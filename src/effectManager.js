const t = require('three');
const pp = require('postprocessing');
const Shader = require('./shader');

class EffectManager {
  constructor(scene, camera, renderer) {
    this.composer = new pp.EffectComposer(renderer);

    this.renderPass = new pp.RenderPass(scene, camera);
    this.blurPass = new pp.BlurPass();
    this.blurPass.kernelSize = pp.KernelSize.SMALL;

    this.shader = new Shader();
    this.effectPass = new pp.EffectPass(camera, this.shader);

    this.effectPass.renderToScreen = true;

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.blurPass);
    this.composer.addPass(this.effectPass);
    this.clock = new t.Clock();
  }

  render() {
    this.composer.render(this.clock.getDelta());
  }

  toggleBlur() {
    this.blurPass.enabled = !this.blurPass.enabled;
    return this.blurPass.enabled;
  }

  setSize(w, h) {
    this.composer.setSize(w, h);
  }
}

module.exports = EffectManager;
