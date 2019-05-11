const three = require('three');
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
    this.renderer = new three.WebGLRenderer();

    this.domElement = this.renderer.domElement;
    this.time = 0;
  }
}

Simulation.prototype.increment = function increment() {
  this.jetController.increment(this.time);
  this.renderer.render(this.scene, this.camera);
  this.time += 1;
};

Simulation.prototype.setAspect = function setAspect(width, height) {
  const lrPlane = Math.floor(this.settings.terminationRadius * 1.2) * width / height;
  this.camera.left = -lrPlane;
  this.camera.right = lrPlane;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
  this.renderer.render(this.scene, this.camera);
};

Simulation.prototype.dispose = function dispose() {
  this.renderer.dispose();
};

module.exports = Simulation;
