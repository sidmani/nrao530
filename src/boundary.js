const t = require('three');

class Boundary {
  constructor() {
    this.group = new t.Group();
    this.numPoints = 1000;
    this.geometry = new t.BufferGeometry();
    const positions = new Float32Array(this.numPoints * 3);
    const colors = new Float32Array(this.numPoints * 3);
    this.geometry.addAttribute('color', new t.BufferAttribute(colors, 3));
    this.geometry.addAttribute('position', new t.BufferAttribute(positions, 3));
    const material = new t.PointsMaterial({ vertexColors: t.VertexColors });
    this.particles = new t.Points(this.geometry, material);
    this.group.add(this.particles);

    this.nextPoint = 0;
  }
}

Boundary.prototype.increment = function increment(newPoints) {
  const psn = this.particles.geometry.attributes.position.array;
  const colors = this.particles.geometry.attributes.color.array;

  const n = this.nextPoint * 3;
  for (let i = 0, l = newPoints.length; i < l; i += 1) {
    psn[n + i] = newPoints[i];
    colors[n + i] = 0xff;
  }

  this.nextPoint = (this.nextPoint + newPoints.length / 3) % this.numPoints;

  for (let i = 0, l = colors.length; i < l; i += 1) {
    colors[i] *= 0.9;
  }
  this.particles.geometry.attributes.position.needsUpdate = true;
  this.particles.geometry.attributes.color.needsUpdate = true;
};

module.exports = Boundary;
