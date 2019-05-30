const t = require('three');

class Jet {
  constructor(settings, scale = 1) {
    this.r = settings.terminationRadius;
    this.cf = settings.terminationCoolingFactor;
    this.ev = settings.emissionVelocity * scale;

    this.numPoints = 3 * Math.ceil(this.r / settings.emissionVelocity);

    this.geometry = new t.BufferGeometry();
    const positions = new Float32Array(this.numPoints * 3);
    const colors = new Float32Array(this.numPoints * 3);

    this.geometry.addAttribute('color', new t.BufferAttribute(colors, 3));
    this.geometry.addAttribute('position', new t.BufferAttribute(positions, 3));
    const material = new t.PointsMaterial({
      size: 15,
      vertexColors: t.VertexColors,
      blending: t.CustomBlending,
      blendEquation: t.MaxEquation,
      transparent: true,
      depthWrite: false,
    });
    this.particles = new t.Points(this.geometry, material);

    this.next = 0;
    this.available = [];
    this.framesToEdge = new Float32Array(this.numPoints);
    this.framesSinceStart = new Float32Array(this.numPoints);

    this.maxBrightness = (1 - settings.emissionVelocity) ** 3.2;
  }
}

Jet.prototype.setPointSize = function setPointSize(s) {
  this.particles.material.size = s;
};

Jet.prototype.increment = function increment(angle, direction) {
  this.updatePoints();
  this.emit(direction);

  this.particles.geometry.attributes.position.needsUpdate = true;
  this.particles.geometry.attributes.color.needsUpdate = true;
};

Jet.prototype.emit = function emit(direction) {
  const p = this.particles.geometry.attributes.position.array;
  const c = this.particles.geometry.attributes.color.array;

  const factor = (1 - direction.z * this.ev);
  const adjEV = this.ev / factor;
  const k = this.available.pop() || this.next++;
  const np = k * 3;

  p[np] = direction.x * adjEV;
  p[np + 1] = direction.y * adjEV;
  p[np + 2] = direction.z * adjEV;

  // calculate relativistic beaming factor
  c[np] = this.maxBrightness / (factor ** 3.2);
  this.framesSinceStart[k] = 1;
  this.framesToEdge[k] = Math.ceil(Math.abs(this.r / adjEV));
};

Jet.prototype.updatePoints = function updatePoints() {
  const p = this.particles.geometry.attributes.position.array;
  const c = this.particles.geometry.attributes.color.array;

  for (let i = 0; i < this.next; i++) {
    const n = 3 * i;
    if (this.framesToEdge[i] > 0) {
      const s = 1 + 1 / this.framesSinceStart[i];
      p[n] *= s;
      p[n + 1] *= s;
      p[n + 2] *= s;
      this.framesSinceStart[i] += 1;
      this.framesToEdge[i] -= 1;
    } else if (this.framesToEdge[i] === 0) {
      c[n] = 1;
      this.framesToEdge[i] = -1;
    } else if (this.framesToEdge[i] === -1) {
      if (c[n] < 0.001) {
        p[n] = 0;
        p[n + 1] = 0;
        p[n + 2] = 0;
        c[n] = 1;
        this.available.push(i);
        this.framesToEdge[i] = -2;
      } else {
        c[n] *= this.cf;
      }
    }
  }
};
module.exports = Jet;
