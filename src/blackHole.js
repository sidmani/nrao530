const t = require('three');

const Jet = require('./jet');



function drawLine(v, r, g, b) {
  const geom = new t.BufferGeometry();
  const vertices = [-100 * v.x, -100 * v.y, -100 * v.z, 0, 0, 0, 100 * v.x, 100 * v.y, 100 * v.z];
  const colors = [r, g, b, r, g, b, r, g, b];
  geom.addAttribute('position', new t.Float32BufferAttribute(vertices, 3));
  geom.addAttribute('color', new t.Float32BufferAttribute(colors, 3));
  const lineMaterial = new t.LineBasicMaterial({ vertexColors: t.VertexColors });
  return new t.Line(geom, lineMaterial);
}

class BlackHole {
  constructor(settings, addObject) {
    this.addObject = addObject;
    this.group = new t.Group();

    // setup graphics
    // black hole
    const material = new t.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new t.Mesh(new t.SphereBufferGeometry(10, 32, 32), material);
    this.group.add(sphere);
    // precession axis
//    if (settings.showPAxis) this.group.add(drawLine(this.pAxis, 0, 0xff, 0));

    // rotation axis
//    if (settings.showRAxis) this.group.add(drawLine(this.rAxis, 0xff, 0, 0));
  }
}

module.exports = BlackHole;
