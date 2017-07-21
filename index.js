'use strict';

var pixel = new ImageData(1, 1);
var point = { x: 0, y: 0 };
var blank = [0, 0, 0, 255];

var clamp = function (v, max) { return (v >= max ? max - 1 : Math.max(v, 0)); };
var pleat = function (v, max) { return (v >= max || v < 0 ? v + (max * Math.sign(v)) : v); };
var skirt = function (v, max) { return (v >= max || v < 0 ? NaN : v); };

var shift = function (color, scale) {
  var ratio = scale * (color - 128) / 256;

  return Math.sign(ratio) * Math.round(Math.abs(ratio))
};

var Crook = function (ref) {
  if ( ref === void 0 ) ref = {};
  var channel = ref.channel; if ( channel === void 0 ) channel = point;
  var scale = ref.scale; if ( scale === void 0 ) scale = point;
  var mode = ref.mode; if ( mode === void 0 ) mode = 0;

  // Wrap how?
  var round = mode ? mode === 1 ? clamp : pleat : skirt;

  // Expects and returns `ImageData`
  return function (source, ref) {
    if ( source === void 0 ) source = pixel;
    if ( ref === void 0 ) ref = pixel;
    var w = ref.width;
    var h = ref.height;
    var lookup = ref.data;

    var target = new ImageData(w, h);
    var targetView = new Int32Array(target.data.buffer);
    var sourceView = new Int32Array(source.data.buffer);

    for (var i = 0, max = w * h; i < max; i += 1) {
      var j = i * 4;

      var x = i % w;
      var y = Math.floor(i / w);

      var x1 = x + shift(lookup[j + channel.x], scale.x);
      var y1 = y + shift(lookup[j + channel.y], scale.y);

      var x2 = round(x1, w);
      var y2 = round(y1, h);

      var k = x2 + (y2 * w);

      targetView[i] = k >= 0 ? sourceView[k] : blank;
    }

    return target
  }
};

module.exports = Crook;

