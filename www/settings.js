const Settings = {
  default: {
    pAxisTheta: 1.3,
    pAxisPhi: -0.2,
    openingAngle: 0.2708,
    precRate: 5,
    emissionVelocity: 0.2,
    terminationRadius: 400,
    terminationCoolingFactor: 0.95,
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
