const t = require('three');

class Helper {
  constructor(jetController, settings) {
    this.jetController = jetController;
    this.scene = new t.Scene();

    // precession axis
    this.pAxis = new t.ArrowHelper(jetController.pAxis, new t.Vector3(), settings.terminationRadius / 2, 0x00ff00, 20, 5);

    // emission axis
    this.rAxis = new t.ArrowHelper(jetController.rAxis, new t.Vector3(), settings.terminationRadius / 2, 0xff0000, 20, 5);

    this.scene.add(this.pAxis, this.rAxis);
  }

  toggle(name) {
    this[name].visible = !this[name].visible;
  }

  update() {
    this.rAxis.setDirection(this.jetController.rAxis);
  }
}

module.exports = Helper;
