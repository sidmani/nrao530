const Settings = {
  default: {
    blackHole: {
      showPAxis: true,
      showRAxis: true,
      pAxis: {
        theta: 1,
        phi: 1,
      },
      rAxis: {
        theta: 0,
        phi: 0,
      },
      precRate: 0.1,
      emissionVelocity: 10,
    },
    jets: {
      terminationRadius: 400,
      show: true,
    },
    sim: {
      showFPS: true,
      timescale: 1, // kyr / 60frame
    },
  },
};

Settings.get = function getSettings() {
  let saved;
  if (saved = window.sessionStorage.getItem('settings')) {
    return JSON.parse(saved);
  }
  return Settings.default;
};

Settings.set = function updateSettings(obj) {
  window.sessionStorage.setItem('settings', JSON.stringify(obj));
};
