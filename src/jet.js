const t = require('three');

class Jet {
  constructor(settings, scale = 1) {
    this.r = settings.terminationRadius;
    this.cf = settings.terminationCoolingFactor;
    this.ev = settings.emissionVelocity * scale;
    this.group = new t.Group();

    // figure out when strike time switches inc -> dec etc
    this.sVal = -1 / (this.r * settings.precRate * (Math.sin(settings.pAxisTheta) ** 2));
    const sol1 = Math.asin(this.sVal);
    this.numPoints = 4 * Math.ceil(this.r / settings.emissionVelocity);
    if (isNaN(sol1)) {
      this.countDec = 0;
    } else {
      const sol2 = Math.PI - sol1;
      this.countDec = Math.ceil(this.numPoints * Math.abs(sol2 - sol1) / (2 * Math.PI));
    }
    this.countInc = this.numPoints - this.countDec;
    console.log(this.countInc);
    console.log(this.countDec);
    this.geometry = new t.BufferGeometry();
    const positions = new Float32Array(this.numPoints * 3);
    const colors = new Float32Array(this.numPoints * 3);
    this.geometry.addAttribute('color', new t.BufferAttribute(colors, 3));
    this.geometry.addAttribute('position', new t.BufferAttribute(positions, 3));
    const material = new t.PointsMaterial({ vertexColors: t.VertexColors });
    this.particles = new t.Points(this.geometry, material);

    this.nextInc = 0;
    this.lastInc = 0;
    this.nextDec = 0;

    this.framesToEdge = new Float32Array(this.numPoints);
    this.framesSinceStart = new Float32Array(this.numPoints);
    this.group.add(this.particles);
//    this.coolFrames = Math.ceil(Math.log(0.1) / Math.log(this.cf));
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

  for (let i = 0; i < this.nextDec; i += 1) {
    const a = i + this.countInc;
    const n = 3 * a;
    const s = 1 + 1 / this.framesSinceStart[a];
    positions[n] *= s;
    positions[n + 1] *= s;
    positions[n + 2] *= s;
    this.framesSinceStart[a] += 1;
    this.framesToEdge[a] -= 1;
  }

  const min = (this.nextInc >= this.lastInc) ? this.nextInc : (this.countInc + this.nextInc);
  for (let i = this.lastInc; i < min; i += 1) {
    const a = i % this.countInc;
    const n = 3 * a;
    const s = 1 + 1 / this.framesSinceStart[a];

    positions[n] *= s;
    positions[n + 1] *= s;
    positions[n + 2] *= s;
    this.framesSinceStart[a] += 1;
    this.framesToEdge[a] -= 1;
  }

  while (this.framesToEdge[this.nextDec + this.countInc] === 0) {
    const l = 3 * (this.nextDec + this.countInc);
    assign3(positions, l, 0);
    this.framesToEdge[this.nextDec + this.countInc] = -1;
    this.nextDec = Math.max(this.nextDec - 1, 0);
  }

  const adjEV = this.ev / (1 - direction.z * this.ev);
  let k;
  if (Math.sin(angle) <= this.sVal) {
    console.log('dec')
    // decreasing
    k = this.countInc + this.nextDec;
    this.nextDec = (this.nextDec + 1) % this.countDec;
  } else {
    // increasing
    k = this.nextInc;
    this.nextInc = (this.nextInc + 1) % this.countInc;
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

  while (this.framesToEdge[this.lastInc] === 0) {
    const l = 3 * this.lastInc;
    assign3(positions, l, 0);
    this.framesToEdge[this.lastInc] = -1;
    this.lastInc = (this.lastInc + 1) % this.countInc;
  }

  console.log(this.framesToEdge[-1 + this.nextDec + this.countInc]);


  this.particles.geometry.attributes.position.needsUpdate = true;
  this.particles.geometry.attributes.color.needsUpdate = true;
};

module.exports = Jet;
