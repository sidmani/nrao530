const three = require('three');
const BlackHole = require('./blackHole');

class Simulation {
  constructor(settings) {
    this.settings = settings;
    this.hole = new BlackHole(settings.blackHole);

    this.scene = new three.Scene();
    const tr = settings.jets.terminationRadius * 2;
    this.camera = new three.OrthographicCamera(-tr, tr, tr, -tr, 100, 5000);
    this.camera.position.z = 1000;
    this.camera.lookAt(0, 0, 0);
    this.renderer = new three.WebGLRenderer();
    this.hole.objects.forEach(o => this.scene.add(o));

    this.domElement = this.renderer.domElement;
  }
}

Simulation.prototype.increment = function increment() {
  const objs = this.hole.increment();
  objs.forEach(o => this.scene.add(o.object));
  this.renderer.render(this.scene, this.camera);
};

Simulation.prototype.setAspect = function setAspect(width, height) {
  const lrPlane = this.settings.jets.terminationRadius * 2 * width / height;
  this.camera.left = -lrPlane;
  this.camera.right = lrPlane;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
  this.renderer.render(this.scene, this.camera);
};

module.exports.Controller = Simulation;
module.exports.gfx = three;
