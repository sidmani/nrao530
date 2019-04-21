class Matter {
  constructor(velocity, position, mass) {
    this.velocity = velocity;
    this.position = position;
    this.mass = mass;
  }
}

Matter.prototype.increment = function () {
  this.position.sum(this.velocity);
}

