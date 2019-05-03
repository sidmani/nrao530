const t = require('three');

class BlackHole {
  constructor(settings, addObject) {
    this.addObject = addObject;
    this.group = new t.Group();

    // setup graphics
    // black hole
    const material = new t.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new t.Mesh(new t.SphereBufferGeometry(10, 32, 32), material);
    this.group.add(sphere);
  }
}

module.exports = BlackHole;
