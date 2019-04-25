const three = require('three');

class Matter {
  constructor(velocity, position, mass) {
    this.velocity = velocity;
    this.position = position;
    this.mass = mass;

    const material = new three.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new three.Mesh(new three.SphereBufferGeometry(5, 16, 16), material);
    sphere.position.copy(position);

    this.object = sphere;
  }
}

Matter.prototype.increment = function increment() {
  // this.position.add(this.velocity);
  this.object.position.add(this.velocity);
};

module.exports = Matter;
