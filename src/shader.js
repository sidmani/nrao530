// colormap from https://github.com/kbinani/colormap-shaders/

// The MIT License (MIT)
//
// Copyright (c) 2015 kbinani
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const t = require('three');
const pp = require('postprocessing');

const fragment = `
uniform float high;
uniform float low;

vec4 colormap(float x) {
  x = clamp(x, low, high);
  x = (x - low) / (high - low);
  float r = clamp(8.0 / 3.0 * x, 0.0, 1.0);
  float g = clamp(8.0 / 3.0 * x - 1.0, 0.0, 1.0);
  float b = clamp(4.0 * x - 3.0, 0.0, 1.0);
  return vec4(r, g, b, 1.0);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = colormap(inputColor.r);
}
`;

class IntensityMap extends pp.Effect {
  constructor() {
    super('IntensityMap', fragment, { uniforms: new Map([['low', new t.Uniform(0)], ['high', new t.Uniform(1)]]) });
  }

  setLow(val) {
    this.uniforms.get('low').value = val;
  }

  setHigh(val) {
    this.uniforms.get('high').value = val;
  }
}

module.exports = IntensityMap;
