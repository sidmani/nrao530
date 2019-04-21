const BlackHole = require('./blackHole');
const Detector = require('./detector');
const Vector = require('./vector');

class Simulation {
  constructor(pAxis, pAngle, rOffset, rRate) {
    this.hole = new BlackHole(pAxis, pAngle, rOffset, rRate);
    this.detectors = [];
  }
}

Simulation.prototype.addDetector = function (position, resX, resY) {
  this.detectors.push(new Detector(position, resX, resY));
};

Simulation.prototype.increment = function() {
  this.hole.increment();
};

const s = new Simulation(new Vector(1, 0, 0), 1, 0, 0.01);
console.log(s.hole.c);
console.log(s.hole.d);
for (let i = 0; i < 5; i++) {
  console.log(s.hole.rAngle);
  console.log(s.hole.rAxis);
  s.increment();
}
