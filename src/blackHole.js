const {
  Vector3,
  SphereBufferGeometry,
  BufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Line,
  Float32BufferAttribute,
  VertexColors,
  LineBasicMaterial,
} = require('three');

const Matter = require('./matter');

const emissionVelocity = 10;

class BlackHole {
  constructor(pAxis, rAxis, rRate) {
    this.pAxis = pAxis.normalize();
    this.rRate = rRate; // rate of precession (rad / Kyr)
    this.rAxis = rAxis.normalize();
    this.rAngle = 0;
    this.jets = [];
    // setup graphics
    this.objects = [];

    // black hole
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new Mesh(new SphereBufferGeometry(10, 32, 32), material);
    sphere.position.set(0, 0, 0);
    this.objects.push(sphere);

    // precession axis
    const pAxisGeom = new BufferGeometry();
    let vertices = [-100 * pAxis.x, -100 * pAxis.y, -100 * pAxis.z, 0, 0, 0, 100 * pAxis.x, 100 * pAxis.y, 100 * pAxis.z];
    let colors = [0, 0, 0xff, 0, 0, 0xff, 0, 0, 0xff];
    pAxisGeom.addAttribute('position', new Float32BufferAttribute(vertices, 3));
    pAxisGeom.addAttribute('color', new Float32BufferAttribute(colors, 3));
    const lineMaterial = new LineBasicMaterial({ vertexColors: VertexColors });
    this.objects.push(new Line(pAxisGeom, lineMaterial));

    // rotation axis
    const rAxisGeom = new BufferGeometry();
    vertices = [-100 * rAxis.x, -100 * rAxis.y, -100 * rAxis.z, 0, 0, 0, 100 * rAxis.x, 100 * rAxis.y, 100 * rAxis.z];
    colors = [0xff, 0, 0, 0xff, 0, 0, 0xff, 0, 0];
    rAxisGeom.addAttribute('position', new Float32BufferAttribute(vertices, 3));
    rAxisGeom.addAttribute('color', new Float32BufferAttribute(colors, 3));
    this.objects.push(new Line(rAxisGeom, lineMaterial));
  }
}

BlackHole.prototype.precess = function precess() {
  // set angle around precession axis
  this.rAngle += this.rRate;
  this.rAxis.applyAxisAngle(this.pAxis, this.rRate);
};

// emit a single matter unit
BlackHole.prototype.emit = function emit() {
  const m = new Matter(this.rAxis.clone().multiplyScalar(emissionVelocity), new Vector3(), 1);
  const m2 = new Matter(this.rAxis.clone().multiplyScalar(-emissionVelocity), new Vector3(), 1);
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
