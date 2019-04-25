const three = require('three');
const BlackHole = require('./blackHole');

class Simulation {
  constructor(pAxis, rAxis, rRate) {
    this.hole = new BlackHole(pAxis, rAxis, rRate);
  }
}

Simulation.prototype.increment = function increment() {
  const objs = this.hole.increment();
  objs.forEach(o => this.scene.add(o.object));
};

Simulation.prototype.add3DVisualizer = function add3DVisualizer(width, height) {
  this.scene = new three.Scene();
  this.camera = new three.PerspectiveCamera(100, width / height, 10, 1500);
  this.camera.position.set(0, 0, 1000);
  this.camera.lookAt(0, 0, 0);
  this.renderer = new three.WebGLRenderer();
  this.renderer.setSize(width, height);

  this.hole.objects.forEach(o => this.scene.add(o));
  return this.renderer;
};

module.exports.Controller = Simulation;
module.exports.gfx = three;
