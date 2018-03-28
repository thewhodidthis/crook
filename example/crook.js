(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.crook = factory());
}(this, (function () { 'use strict';

  // Three ways of handling excess
  const clamp = (v, max) => (v >= max ? max - 1 : Math.max(v, 0));
  const pleat = (v, max) => (v >= max || v < 0 ? v + (max * Math.sign(v)) : v);
  const skirt = (v, max) => (v >= max || v < 0 ? NaN : v);

  // Color shift above and below gray
  const shift = (color, scale) => {
    const ratio = scale * (color - 128) / 256;

    return Math.sign(ratio) * Math.round(Math.abs(ratio))
  };

  // Extract options for color channel, scaling across each axis, edge work type
  const crook = ({ channel = { x: 0, y: 0 }, scale = channel, mode = 0 } = {}) => {
    // Wrap how?
    const round = mode ? mode === 1 ? clamp : pleat : skirt;

    // Expects and returns an `ImageData` like object plus a color map of similar type
    return (target = { data: [], width: 0, height: 0 }, lookup = target) => {
      const bitmap = new Int32Array(target.data.buffer);
      const mirror = new Int32Array(bitmap);

      // Extract color map dimensions
      const { width: w, height: h } = lookup;

      for (let i = 0, stop = w * h; i < stop; i += 1) {
        // In steps of four - r/g/b/a
        const j = i * 4;

        // Calculate pixel coords
        const x = i % w;
        const y = Math.floor(i / w);

        // Process coords
        const x1 = x + shift(lookup.data[j + channel.x], scale.x);
        const y1 = y + shift(lookup.data[j + channel.y], scale.y);

        const x2 = round(x1, w);
        const y2 = round(y1, h);

        // Find color map index at pixel coords
        const k = x2 + (y2 * w);

        // Replace input data with color map data at index, or a blank pixel if index negative
        bitmap[i] = k >= 0 ? mirror[k] : [0, 0, 0, 255];
      }

      return target
    }
  };

  return crook;

})));
