const t = require('three');

const Matter = require('./matter');


function sp2rect(a) {
  return new t.Vector3(Math.sin(a.theta), Math.sin(a.phi), Math.cos(a.theta));
}

class BlackHole {
  constructor(bh) {
    this.pAxis = sp2rect(bh.pAxis).normalize();
    this.rRate = bh.precRate; // rate of precession (rad / Kyr)
    this.rAxis = sp2rect(bh.rAxis).normalize();
    this.rAngle = 0;
    this.emissionVelocity = bh.emissionVelocity;
    // setup graphics
    this.objects = [];
    this.jets = [];
    // black hole
    const material = new t.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new t.Mesh(new t.SphereBufferGeometry(10, 32, 32), material);
    sphere.position.set(0, 0, 0);
    this.objects.push(sphere);

    // precession axis
    const pAxisGeom = new t.BufferGeometry();
    let vertices = [-100 * this.pAxis.x, -100 * this.pAxis.y, -100 * this.pAxis.z, 0, 0, 0, 100 * this.pAxis.x, 100 * this.pAxis.y, 100 * this.pAxis.z];
    let colors = [0, 0, 0xff, 0, 0, 0xff, 0, 0, 0xff];
    pAxisGeom.addAttribute('position', new t.Float32BufferAttribute(vertices, 3));
    pAxisGeom.addAttribute('color', new t.Float32BufferAttribute(colors, 3));
    const lineMaterial = new t.LineBasicMaterial({ vertexColors: t.VertexColors });
    this.objects.push(new t.Line(pAxisGeom, lineMaterial));

    // rotation axis
    const rAxisGeom = new t.BufferGeometry();
    vertices = [-100 * this.rAxis.x, -100 * this.rAxis.y, -100 * this.rAxis.z, 0, 0, 0, 100 * this.rAxis.x, 100 * this.rAxis.y, 100 * this.rAxis.z];
    colors = [0xff, 0, 0, 0xff, 0, 0, 0xff, 0, 0];
    rAxisGeom.addAttribute('position', new t.Float32BufferAttribute(vertices, 3));
    rAxisGeom.addAttribute('color', new t.Float32BufferAttribute(colors, 3));
    this.objects.push(new t.Line(rAxisGeom, lineMaterial));
  }
}

BlackHole.prototype.precess = function precess() {
  // set angle around precession axis
  this.rAngle += this.rRate;
  this.rAxis.applyAxisAngle(this.pAxis, this.rRate);
};

// emit a single matter unit
BlackHole.prototype.emit = function emit() {
  const m = new Matter(this.rAxis.clone().multiplyScalar(this.emissionVelocity), new t.Vector3(), 1);
  const m2 = new Matter(this.rAxis.clone().multiplyScalar(-this.emissionVelocity), new t.Vector3(), 1);
  this.jets.push(m, m2);
  return [m, m2];
};

BlackHole.prototype.increment = function increment() {
  for (let i = 0, len = this.jets.length; i < len; i += 1) {
    this.jets[i].increment();
  }

  this.precess();
  return this.emit();
};

module.exports = BlackHole;
