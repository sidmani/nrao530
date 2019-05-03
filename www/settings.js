const Settings = {
  default: {
    showPAxis: true,
    showRAxis: true,
    pAxisTheta: 0.2,
    pAxisPhi: -0.2,
    rAxisTheta: 0,
    rAxisPhi: 0,
    precRate: 0.001,
    emissionVelocity: 0.2,
    terminationRadius: 400,
    terminationCoolingFactor: 0.95,
    showFPS: true,
    timescale: 1, // kyr / 60frame
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
