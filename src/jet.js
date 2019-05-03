const t = require('three');

class Jet {
  constructor(settings, scale = 1) {
    this.r = settings.terminationRadius;

    this.ev = settings.emissionVelocity;
    this.scale = scale;
    this.group = new t.Group();

    this.numPoints = 2 * Math.ceil(settings.terminationRadius / settings.emissionVelocity);
    this.geometry = new t.BufferGeometry();
    const positions = new Float32Array(this.numPoints * 3);
    const colors = new Float32Array(this.numPoints * 3);
    this.geometry.addAttribute('color', new t.BufferAttribute(colors, 3));
    this.geometry.addAttribute('position', new t.BufferAttribute(positions, 3));
    const material = new t.PointsMaterial({ vertexColors: t.VertexColors });
    this.particles = new t.Points(this.geometry, material);

    this.nextPoint = 0;
    this.framesToEdge = new Float32Array(this.numPoints);
    this.framesSinceStart = new Float32Array(this.numPoints);
    this.group.add(this.particles);
  }
}

Jet.prototype.increment = function increment(direction) {
  const positions = this.particles.geometry.attributes.position.array;
  const colors = this.particles.geometry.attributes.color.array;

  const np = 3 * this.nextPoint;
  const adjEV = this.ev / (1 - this.scale * direction.z * this.ev);
  positions[np] = direction.x * adjEV * this.scale;
  positions[np + 1] = direction.y * adjEV * this.scale;
  positions[np + 2] = direction.z * adjEV * this.scale;
  colors[np] = 0x7f * direction.z + 0x7f;
  this.framesSinceStart[this.nextPoint] = 1;
  this.framesToEdge[this.nextPoint] = Math.ceil(this.r / adjEV);
  this.nextPoint = (this.nextPoint + 1) % this.numPoints;

  for (let i = 0; i < this.numPoints; i += 1) {
    const n = 3 * i;
    if (this.framesToEdge[i] === 0) {
      colors[n] = 0.9 * colors[n];
    } else {
      const s = 1 + 1 / this.framesSinceStart[i];
      positions[n] *= s;
      positions[n + 1] *= s;
      positions[n + 2] *= s;
      this.framesToEdge[i] -= 1;
      this.framesSinceStart[i] += 1;
    }
  }

  this.particles.geometry.attributes.position.needsUpdate = true;
  this.particles.geometry.attributes.color.needsUpdate = true;
};

module.exports = Jet;
