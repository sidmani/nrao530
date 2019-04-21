class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

Vector.zero = function () {
  return new Vector(0, 0, 0);
};

Vector.sum = function (...v) {
  let x = 0, y = 0, z = 0;
  for (let i = 0, len = v.length; i < len; i++) {
    let curr = v[i];
    x += curr.x;
    y += curr.y;
    z += curr.z;
  }
  return new Vector(x, y, z);
};

Vector.scale = function (v, k) {
  return new Vector(v.x * k, v.y * k, v.z * k);
};

Vector.dot = function (u, v) {
  return (v.x * u.x) + (v.y * u.y) + (v.z * u.z);
};

Vector.cross = function (u, v) {
  return new Vector((u.y * v.z) - (u.z * v.y), -(u.x * v.z) + (u.z * v.x), (u.x * v.y) - (u.y * v.z));
};

Vector.prototype.normalize = function () {
  const m = this.magnitude();
  this.x /= m;
  this.y /= m;
  this.z /= m;
  return this;
};

Vector.prototype.magnitude = function () {
  return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
};

Vector.prototype.sum = function (v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  return this;
}

Vector.prototype.scale = function (k) {
  this.x *= k;
  this.y *= k;
  this.z *= k;
  return this;
}

Vector.prototype.fastOrtho = function() {
  if (this.x !== 0) {
    return new Vector(-this.y, this.x, 0).normalize();
  } else if (this.y !== 0) {
    return new Vector(0, this.z, -this.y).normalize();
  } else {
    return new Vector(this.z, -this.y, 0).normalize();
  }
}

module.exports = Vector;
