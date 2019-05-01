const three = require('three');
const BlackHole = require('./blackHole');

class Simulation {
  constructor(settings) {
    this.settings = settings;
    this.scene = new three.Scene();

    this.hole = new BlackHole(settings, o => this.scene.add(o));

    const tr = settings.terminationRadius * 2;
    this.camera = new three.OrthographicCamera(-tr, tr, tr, -tr, 100, 5000);
    this.camera.position.z = 1000;
    this.camera.lookAt(0, 0, 0);
    this.renderer = new three.WebGLRenderer();

    this.domElement = this.renderer.domElement;
  }
}

Simulation.prototype.increment = function increment() {
  this.hole.increment();
  this.renderer.render(this.scene, this.camera);
};

Simulation.prototype.setAspect = function setAspect(width, height) {
  const lrPlane = this.settings.terminationRadius * 2 * width / height;
  this.camera.left = -lrPlane;
  this.camera.right = lrPlane;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
  this.renderer.render(this.scene, this.camera);
};

module.exports.Controller = Simulation;
module.exports.gfx = three;
