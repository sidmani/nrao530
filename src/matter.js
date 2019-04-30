const three = require('three');

class Matter {
  constructor(velocity, position, mass) {
    this.velocity = velocity;
    this.position = position;
    this.mass = mass;
    const toObserver = (new three.Vector3()).subVectors(new three.Vector3(0, 0, 1000), this.position);
    const brightness = (128 + 127 * Math.cos(velocity.angleTo(toObserver))) << 16;
    const material = new three.MeshBasicMaterial({ color: brightness });
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
