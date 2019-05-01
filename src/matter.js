const three = require('three');

const material = new three.MeshBasicMaterial({ color: 0xff0000 });

class Matter {
  constructor() {
    // const toObserver = (new three.Vector3()).subVectors(new three.Vector3(0, 0, 1000), this.position);
    // const brightness = (128 + 127 * Math.cos(velocity.angleTo(toObserver))) << 16;
    const sphere = new three.Mesh(new three.SphereBufferGeometry(5, 16, 16), material);

    this.object = sphere;
  }
}

Matter.prototype.increment = function increment() {
  this.object.position.add(this.velocity);
  this.displacement += this.speed;
};

Matter.prototype.set = function set(velocity, speed) {
  this.displacement = 0;
  this.speed = speed;
  this.object.visible = true;
  this.velocity = velocity;
  this.object.position.set(0, 0, 0);
};

Matter.prototype.dispose = function dispose() {
  this.disposeTargets.forEach(o => o.dispose());
};

module.exports = Matter;
