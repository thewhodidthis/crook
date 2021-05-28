var crook = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // main.js
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default
  });
  var clamp = (v, max) => v >= max ? max - 1 : Math.max(v, 0);
  var pleat = (v, max) => v >= max || v < 0 ? v + max * Math.sign(v) : v;
  var skirt = (v, max) => v >= max || v < 0 ? NaN : v;
  var shift = (color, scale) => {
    const ratio = 390625e-8 * scale * (color - 128);
    return Math.sign(ratio) * Math.round(Math.abs(ratio));
  };
  var crook = ({ channel = { x: 0, y: 0 }, scale = channel, mode = 0 } = {}) => {
    const round = mode ? mode === 1 ? clamp : pleat : skirt;
    return (target = { data: [], width: 0, height: 0 }, lookup = target) => {
      const bitmap = new Int32Array(target.data.buffer);
      const mirror = new Int32Array(bitmap);
      const { width: w, height: h } = lookup;
      for (let i = 0, stop = w * h; i < stop; i += 1) {
        const j = i * 4;
        const x = i % w;
        const y = Math.floor(i / w);
        const x1 = x + shift(lookup.data[j + channel.x], scale.x);
        const y1 = y + shift(lookup.data[j + channel.y], scale.y);
        const x2 = round(x1, w);
        const y2 = round(y1, h);
        const k = x2 + y2 * w;
        bitmap[i] = k >= 0 ? mirror[k] : 0;
      }
      return target;
    };
  };
  var main_default = crook;
  return main_exports;
})();
