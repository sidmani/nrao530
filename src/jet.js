const t = require('three');
const cm = require('./colorMap');

class Jet {
  constructor(settings, scale = 1) {
    this.r = settings.terminationRadius;
    this.cf = settings.terminationCoolingFactor;
    this.ev = settings.emissionVelocity * scale;

    // figure out when strike time switches inc -> dec etc
    this.numPoints = 3 * Math.ceil(this.r / settings.emissionVelocity);

    this.geometry = new t.BufferGeometry();
    const positions = new Float32Array(this.numPoints * 3);
    const colors = new Float32Array(this.numPoints * 3);
    this.geometry.addAttribute('color', new t.BufferAttribute(colors, 3));
    this.geometry.addAttribute('position', new t.BufferAttribute(positions, 3));
    const material = new t.PointsMaterial({ vertexColors: t.VertexColors });
    this.particles = new t.Points(this.geometry, material);

    this.next = 0;
    this.available = [];
    this.cIdx = new Uint8Array(this.numPoints);
    this.framesToEdge = new Float32Array(this.numPoints);
    this.framesSinceStart = new Float32Array(this.numPoints);
    this.group = this.particles;

    this.maxBrightness = (1 - settings.emissionVelocity) ** 3.2;
  }
}

Jet.prototype.increment = function increment(angle, direction) {
  this.updatePoints();
  this.emit(direction);

  this.particles.geometry.attributes.position.needsUpdate = true;
  this.particles.geometry.attributes.color.needsUpdate = true;
};

Jet.prototype.emit = function emit(direction) {
  const p = this.particles.geometry.attributes.position.array;
  const c = this.particles.geometry.attributes.color.array;

  const adjEV = this.ev / (1 - direction.z * this.ev);
  const k = this.available.pop() || this.next++;
  const np = k * 3;

  p[np] = direction.x * adjEV;
  p[np + 1] = direction.y * adjEV;
  p[np + 2] = direction.z * adjEV;

  // calculate relativistic beaming factor
  const B = Math.floor(this.maxBrightness / ((1 - this.ev * direction.z) ** 3.2) * 0xff);
  c[np] = cm.R[B];
  c[np + 1] = cm.G[B];
  c[np + 2] = cm.B[B];
  this.cIdx[k] = B;

  this.framesSinceStart[k] = 1;
  this.framesToEdge[k] = Math.ceil(Math.abs(this.r / adjEV));
};

Jet.prototype.updatePoints = function updatePoints() {
  const p = this.particles.geometry.attributes.position.array;
  const c = this.particles.geometry.attributes.color.array;

  for (let i = 0; i < this.next; i += 1) {
    const n = 3 * i;
    if (this.framesToEdge[i] > 0) {
      const s = 1 + 1 / this.framesSinceStart[i];
      p[n] *= s;
      p[n + 1] *= s;
      p[n + 2] *= s;
      this.framesSinceStart[i] += 1;
      this.framesToEdge[i] -= 1;
    } else if (this.framesToEdge[i] === 0) {
      this.cIdx[i] = 0xff;
      this.framesToEdge[i] = -1;
    } else if (this.framesToEdge[i] === -1) {
      if (this.cIdx[i] < 20) {
        p[n] = 0;
        p[n + 1] = 0;
        p[n + 2] = 0;
        this.available.push(i);
        this.framesToEdge[i] = -2;
      } else {
        const x = this.cIdx[i]--;
        c[n] = cm.R[x];
        c[n + 1] = cm.G[x];
        c[n + 2] = cm.B[x];
      }
    }
  }
};
module.exports = Jet;
