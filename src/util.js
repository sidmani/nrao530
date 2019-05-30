const t = require('three');

module.exports = {
  sp2rect(theta, phi) {
    return new t.Vector3(Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta));
  },
};
