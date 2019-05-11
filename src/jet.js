const t = require('three');

class Jet {
  constructor(settings, scale = 1) {
    this.r = settings.terminationRadius;
    this.cf = settings.terminationCoolingFactor;
    this.ev = settings.emissionVelocity * scale;
    this.group = new t.Group();

    // figure out when strike time switches inc -> dec etc
    this.numPoints = 4 * Math.ceil(this.r / settings.emissionVelocity);
    this.geometry = new t.BufferGeometry();
    const positions = new Float32Array(this.numPoints * 3);
    const colors = new Float32Array(this.numPoints * 3);
    this.geometry.addAttribute('color', new t.BufferAttribute(colors, 3));
    this.geometry.addAttribute('position', new t.BufferAttribute(positions, 3));
    const material = new t.PointsMaterial({ vertexColors: t.VertexColors });
    this.particles = new t.Points(this.geometry, material);

    this.next = 0;
    this.available = [];
    this.framesToEdge = new Float32Array(this.numPoints);
    this.framesSinceStart = new Float32Array(this.numPoints);
    this.group.add(this.particles);
  }
}

function assign3(arr, pos, val) {
  arr[pos] = val;
  arr[pos + 1] = val;
  arr[pos + 2] = val;
}

Jet.prototype.increment = function increment(angle, direction) {
  const positions = this.particles.geometry.attributes.position.array;
  const colors = this.particles.geometry.attributes.color.array;

  for (let i = 0; i < this.next; i++) {
    const n = 3 * i;
    if (this.framesToEdge[i] > 0) {
      const s = 1 + 1 / this.framesSinceStart[i];
      positions[n] *= s;
      positions[n + 1] *= s;
      positions[n + 2] *= s;
      this.framesSinceStart[i] += 1;
      this.framesToEdge[i] -= 1;
    } else if (this.framesToEdge[i] === 0) {
      colors[n] *= this.cf;
      colors[n+1] *= this.cf;
      colors[n+2] *= this.cf;
      if (colors[n] < 25) {
        assign3(positions, i * 3, 0);
        this.available.push(i);
        this.framesToEdge[i] = -1;
      }
    }
  }

  console.log(this.next);

  const adjEV = this.ev / (1 - direction.z * this.ev);
  let k;
  if (this.available.length > 0) {
    k = this.available.pop();
  } else {
    k = this.next;
    this.next += 1;
  }
  const np = k * 3;

  positions[np] = direction.x * adjEV;
  positions[np + 1] = direction.y * adjEV;
  positions[np + 2] = direction.z * adjEV;
  colors[np] = 0xff;
  colors[np + 1] = 0;
  colors[np + 2] = 0;

  this.framesSinceStart[k] = 1;
  this.framesToEdge[k] = Math.ceil(Math.abs(this.r / adjEV));

  this.particles.geometry.attributes.position.needsUpdate = true;
  this.particles.geometry.attributes.color.needsUpdate = true;
};

module.exports = Jet;
