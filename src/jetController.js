const t = require('three');
const Jet = require('./jet');

function sp2rect(theta, phi) {
  return new t.Vector3(Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta));
}

function drawLine(v, r, g, b) {
  const geom = new t.BufferGeometry();
  const vertices = [-100 * v.x, -100 * v.y, -100 * v.z, 0, 0, 0, 100 * v.x, 100 * v.y, 100 * v.z];
  const colors = [r, g, b, r, g, b, r, g, b];
  geom.addAttribute('position', new t.Float32BufferAttribute(vertices, 3));
  geom.addAttribute('color', new t.Float32BufferAttribute(colors, 3));
  const lineMaterial = new t.LineBasicMaterial({ vertexColors: t.VertexColors });
  return new t.Line(geom, lineMaterial);
}

class JetController {
  constructor(settings) {
    this.east = new Jet(settings);
    this.west = new Jet(settings, -1);

    this.group = new t.Group();
    this.group.add(this.east.group, this.west.group);

    this.pAxis = sp2rect(settings.pAxisTheta, settings.pAxisPhi).normalize();
    this.rRate = settings.precRate / 1000; // rate of precession (rad / Myr)
    // cross pAxis with k-hat
    const normal = new t.Vector3(0, 0, 1).cross(this.pAxis).normalize();
    this.rAxis = this.pAxis.clone().applyAxisAngle(normal, -settings.openingAngle);
    this.rAngle = 0;
    this.pAxisLine = drawLine(this.pAxis, 0, 0xff, 0);
    this.group.add(this.pAxisLine);
  }

  togglePAxis() {
    this.pAxisLine.visible = !this.pAxisLine.visible;
  }

  increment() {
    this.east.increment(this.rAngle, this.rAxis);
    this.west.increment(this.rAngle, this.rAxis);
    this.rAngle += this.rRate;
    this.rAxis.applyAxisAngle(this.pAxis, this.rRate);
  }

  setPointSize(s) {
    this.east.setPointSize(s);
    this.west.setPointSize(s);
  }
}

module.exports = JetController;
