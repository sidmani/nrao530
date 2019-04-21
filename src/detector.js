class Detector {
  constructor(position, resolutionX, resolutionY) {
    this.position = position;
    this.array = [];
    for (let i = 0; i < resolutionY; i++) {
      this.array.push(new Uint8Array(resolutionX));
    }
  };
}

module.exports = Detector;
