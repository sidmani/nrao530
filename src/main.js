const three = require('three');

const EffectManager = require('./effectManager');
const JetController = require('./jetController');
const Helper = require('./helper');

class Simulation {
  constructor(settings) {
    this.jetController = new JetController(settings);

    // contains axes, grid, labels
    this.helper = new Helper(this.jetController, settings);

    // contains actual objects
    this.scene = new three.Scene();
    this.scene.add(this.jetController.group);

    this.tr = Math.floor(settings.terminationRadius * 1.2);
    this.camera = new three.OrthographicCamera(-this.tr, this.tr, this.tr, -this.tr);
    this.camera.position.z = settings.terminationRadius * 2;

    this.renderer = new three.WebGLRenderer({ antialias: true });
    this.renderer.autoClear = false;
    this.effectManager = new EffectManager(this.scene, this.camera, this.renderer);

    this.domElement = this.renderer.domElement;
    this.time = 0;
  }

  render() {
    this.helper.update();
    this.effectManager.render();
    this.renderer.render(this.helper.scene, this.camera);
  }

  toggleBlur() {
    this.jetController.setPointSize(this.effectManager.toggleBlur() ? 15 : 1);
    this.render();
  }

  toggle(name) {
    this.helper.toggle(name);
    this.render();
  }

  setLow(val) {
    this.effectManager.shader.setLow(val);
    this.render();
  }

  setHigh(val) {
    this.effectManager.shader.setHigh(val);
    this.render();
  }

  increment() {
    this.jetController.increment(this.time);
    this.time += 1;
    this.render();
  }

  setAspect(width, height) {
    const lrPlane = this.tr * width / height;
    this.camera.left = -lrPlane;
    this.camera.right = lrPlane;
    this.camera.updateProjectionMatrix();
    this.effectManager.setSize(width, height);
    this.render();
  }
}

module.exports = Simulation;
