const t = require('three');
const Jet = require('./jet');
const U = require('./util');

class JetController {
  constructor(settings) {
    this.east = new Jet(settings);
    this.west = new Jet(settings, -1);
    const material = new t.MeshBasicMaterial({ color: 0xff0000, blending: t.CustomBlending, blendEquation: t.MaxEquation });
    this.core = new t.Mesh(new t.SphereBufferGeometry(10, 32, 32), material);

    this.group = new t.Group();
    this.group.add(this.east.particles, this.west.particles, this.core);

    this.pAxis = U.sp2rect(settings.pAxisTheta, settings.pAxisPhi).normalize();
    this.rRate = settings.precRate / 1000; // rate of precession (rad / Myr)
    // cross pAxis with k-hat
    const normal = new t.Vector3(0, 0, 1).cross(this.pAxis).normalize();
    this.rAxis = this.pAxis.clone().applyAxisAngle(normal, -settings.openingAngle);
    this.rAngle = 0;
  }

  toggleCore() {
    this.core.visible = !this.core.visible;
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
