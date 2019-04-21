const Vector = require('./vector');
const Matter = require('./matter');

const emissionVelocity = 0.01; // fraction of c

class BlackHole {
  constructor(pAxis, pAngle, rOffset, rRate) {
    this.pAxis = pAxis.normalize(); // precession axis
    this.rOffset = rOffset; // t = 0 angle around precession axis;
    this.rAngle = rOffset; // angle around precession axis
    this.rRate = rRate; // rate of precession (rad / Kyr)

    // generate orthonormal basis C x D for precession plane
    this.c = pAxis.fastOrtho().scale(Math.sin(pAngle));
    this.d = Vector.cross(this.pAxis, this.c);

    this.jets = [];
  }
}

BlackHole.prototype.precess = function () {
  // set angle around precession axis
  this.rAngle += this.rRate;

  // calculate unit vector for axis of rotation
  this.rAxis = Vector.sum(Vector.scale(this.c, Math.cos(this.rAngle)), Vector.scale(this.d, Math.sin(this.rAngle)), this.pAxis)
    .normalize();
};

// emit a single matter unit
BlackHole.prototype.emit = function () {
  this.jets.push(new Matter(Vector.scale(this.rAxis, emissionVelocity), Vector.zero(), 1));
  this.jets.push(new Matter(Vector.scale(this.rAxis, -emissionVelocity), Vector.zero(), 1));
};

BlackHole.prototype.increment = function () {
  for (let i = 0, len = this.jets.length; i < len; i += 1) {
    this.jets[i].increment();
  }

  this.precess();
};

module.exports = BlackHole;
