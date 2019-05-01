const t = require('three');

const Jet = require('./jet');

function sp2rect(theta, phi) {
  return new t.Vector3(Math.sin(theta), Math.sin(phi), Math.cos(theta));
}

function drawLine(v, r, g, b) {
  const geom = new t.BufferGeometry();
  const vertices = [-100 * v.x, -100 * v.y, -100 * v.z, 0, 0, 0, 100 * v.x, 100 * v.y, 100 * v.z];
  const colors = [r, g, b, r, g, b, r, g, b];
  geom.addAttribute('position', new t.Float32BufferAttribute(vertices, 3));
  geom.addAttribute('color', new t.Float32BufferAttribute(colors, 3));
  const lineMaterial = new t.LineBasicMaterial({ vertexColors: t.VertexColors });
  return new t.Line(geom, lineMaterial);
}

class BlackHole {
  constructor(settings, addObject) {
    this.addObject = addObject;
    this.pAxis = sp2rect(settings.pAxisTheta, settings.pAxisPhi).normalize();
    this.rRate = settings.precRate; // rate of precession (rad / Kyr)
    this.rAxis = sp2rect(settings.rAxisTheta, settings.rAxisPhi).normalize();
    this.rAngle = 0;
    this.emissionVelocity = settings.emissionVelocity;
    // setup graphics
    this.jet = new Jet(settings, addObject);
    // black hole
    const material = new t.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new t.Mesh(new t.SphereBufferGeometry(10, 32, 32), material);
    sphere.position.set(0, 0, 0);
    this.addObject(sphere);
    // precession axis
    if (settings.showPAxis) this.addObject(drawLine(this.pAxis, 0, 0xff, 0));

    // rotation axis
    if (settings.showRAxis) this.addObject(drawLine(this.rAxis, 0xff, 0, 0));
  }
}

BlackHole.prototype.precess = function precess() {
  // set angle around precession axis
  this.rAngle += this.rRate;
  this.rAxis.applyAxisAngle(this.pAxis, this.rRate);
};

// emit a single matter unit
BlackHole.prototype.increment = function increment() {
  this.jet.increment(this.rAxis);
  this.precess();
};

module.exports = BlackHole;
