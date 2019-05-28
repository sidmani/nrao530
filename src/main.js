const three = require('three');
const pp = require('postprocessing');

const BlackHole = require('./blackHole');
const JetController = require('./jetController');

class Simulation {
  constructor(settings) {
    this.settings = settings;
    this.scene = new three.Scene();

    this.hole = new BlackHole(settings);
    this.jetController = new JetController(settings);
    this.scene.add(this.hole.group, this.jetController.group);

    const tr = Math.floor(settings.terminationRadius * 1.2);
    this.camera = new three.OrthographicCamera(-tr, tr, tr, -tr);
    this.camera.position.z = settings.terminationRadius * 2;
    this.camera.lookAt(0, 0, 0);

    const renderer = new three.WebGLRenderer();
    this.composer = new pp.EffectComposer(renderer);

    this.renderPass = new pp.RenderPass(this.scene, this.camera);
    this.blurPass = new pp.BlurPass();
    this.blurPass.kernelSize = pp.KernelSize.MEDIUM;
    this.blurPass.renderToScreen = true;
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.blurPass);
    this.clock = new three.Clock();

    this.domElement = renderer.domElement;
    this.time = 0;
  }

  render() {
    this.composer.render(this.clock.getDelta());
  }

  toggleBlur() {
    const val = this.blurPass.enabled;
    this.blurPass.enabled = !val;
    this.renderPass.renderToScreen = val;
    this.blurPass.renderToScreen = !val;
    this.jetController.setPointSize(val ? 1 : 40);
    this.render();
  }
}

Simulation.prototype.togglePAxis = function togglePAxis() {
  this.jetController.togglePAxis();
  this.render();
};

Simulation.prototype.increment = function increment() {
  this.jetController.increment(this.time);
  this.time += 1;
  this.render();
};

Simulation.prototype.setAspect = function setAspect(width, height) {
  const lrPlane = Math.floor(this.settings.terminationRadius * 1.2) * width / height;
  this.camera.left = -lrPlane;
  this.camera.right = lrPlane;
  this.camera.updateProjectionMatrix();
  this.composer.setSize(width, height);
  this.render();
};

module.exports = Simulation;
