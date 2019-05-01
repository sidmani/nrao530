const t = require('three');
const Matter = require('./matter');

class Jet {
  constructor(settings, addObject) {
    this.pool = [];
    this.visible = [];
    this.r = settings.terminationRadius;
    this.ev = settings.emissionVelocity;
    this.addObject = addObject;
  }
}

Jet.prototype.increment = function increment(direction) {
  for (let i = 0, l = this.visible.length; i < l; i += 1) {
    const o = this.visible[i];
    if (!o.object.visible) return;

    if (o.displacement >= this.r) {
      this.pool.push(i);
      o.object.visible = false;
    } else {
      o.increment();
    }
  }

  const v = direction.clone().multiplyScalar(this.ev);
  let o;
  if (this.pool.length > 0) {
    o = this.visible[this.pool.pop()];
  } else {
    o = new Matter();
    this.visible.push(o);
    this.addObject(o.object);
  }
  o.set(v, this.ev);
};

module.exports = Jet;
