const t = require('three');

class Jet {
  constructor(settings, scale = 1) {
    this.rSq = settings.terminationRadius ** 2;

    this.ev = settings.emissionVelocity * scale;
    this.es = settings.emissionVelocity;
    this.group = new t.Group();

    this.numPoints = Math.ceil(this.r / this.es);
    this.geometry = new t.BufferGeometry();
    const positions = new Float32Array(this.numPoints * 3);
    this.geometry.addAttribute('position', new t.BufferAttribute(positions, 3));
    this.particles = new t.Points(this.geometry);

    this.latestRemoved = 0;
    this.nextPoint = 0;
    this.velocities = new Float32Array(this.numPoints * 3);
    this.group.add(this.particles);
  }
}

Jet.prototype.increment = function increment(direction) {
  const positions = this.particles.geometry.attributes.position.array;
  const velocities = this.velocities;

  // assumption: matter doesn't overtake previously emitted matter
  const newLR = (this.latestRemoved + 1) % this.numPoints;
  const nTR = newLR * 3;
  const maxDisSq = (positions[nTR] ** 2) + (positions[nTR + 1] ** 2) + (positions[nTR + 2] ** 2);
  if (maxDisSq > this.rSq) {
    velocities[nTR] = 0;
    velocities[nTR + 1] = 0;
    velocities[nTR + 2] = 0;
    positions[nTR] = 0;
    positions[nTR + 1] = 0;
    positions[nTR + 2] = 0;
    this.latestRemoved = newLR;
  }

  const np = 3 * this.nextPoint;
  velocities[np] = direction.x * this.ev;
  velocities[np + 1] = direction.y * this.ev;
  velocities[np + 2] = direction.z * this.ev;
  positions[np] = 0;
  positions[np + 1] = 0;
  positions[np + 2] = 0;
  this.nextPoint = (this.nextPoint + 1) % this.numPoints;
  this.particles.geometry.attributes.position.needsUpdate = true;

  const n = this.numPoints * 3;
  for (let i = 0; i < n; i += 1) {
    positions[i] += velocities[i];
  }
};

module.exports = Jet;
