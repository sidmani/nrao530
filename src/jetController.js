const t = require('three');
const Jet = require('./jet');

function sp2rect(theta, phi) {
  return new t.Vector3(Math.sin(theta), Math.sin(phi), Math.cos(theta));
}

class JetController {
  constructor(settings) {
    this.east = new Jet(settings);
    this.west = new Jet(settings, -1);

    this.group = new t.Group();
    this.group.add(this.east.group, this.west.group);

    this.pAxis = sp2rect(settings.pAxisTheta, settings.pAxisPhi).normalize();
    this.rRate = settings.precRate; // rate of precession (rad / Kyr)
    this.rAxis = sp2rect(settings.rAxisTheta, settings.rAxisPhi).normalize();
    this.rAngle = 0;
  }

  increment() {
    this.east.increment(this.rAxis);
    this.west.increment(this.rAxis);
    this.rAngle += this.rRate;
    this.rAxis.applyAxisAngle(this.pAxis, this.rRate);
  }
}

module.exports = JetController;
