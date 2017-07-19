'use strict';

var v2 = { x: 0, y: 0 };
var blank = [0, 0, 0, 255];
var modes = ['IGNORE', 'CLAMP', 'WRAP'];

var shift = function (color, scale) {
  var ratio = scale * (color - 128) / 256;

  return Math.sign(ratio) * Math.round(Math.abs(ratio))
};

var Crook = function (options) {
  var ref = Object.assign({
    // Which color channel to use for calculating displacement
    // 0: Red, 1: Green, 2: Blue, 3: Alpha
    channel: v2,

    // The multiplier to use for scaling the x and y displacement
    // values from the lookup calculation
    scale: v2,

    // Do what with empty pixels?
    mode: 0
  }, options);
  var channel = ref.channel;
  var scale = ref.scale;
  var type = ref.mode;

  var mode = modes[parseInt(type, 10) % modes.length];

  // Expects and returns `ImageData`
  return function (source, ref) {
    if ( ref === void 0 ) ref = ImageData;
    var w = ref.width;
    var h = ref.height;
    var lookup = ref.data;

    var target = new ImageData(source.width, source.height);
    var targetView = new Int32Array(target.data.buffer);
    var sourceView = new Int32Array(source.data.buffer);

    for (var i = 0, max = w * h; i < max; i += 1) {
      var j = i * 4;

      var x1 = i % w;
      var y1 = Math.floor(i / w);

      var x2 = x1 + shift(lookup[j + channel.x], scale.x);
      var y2 = y1 + shift(lookup[j + channel.y], scale.y);

      if (mode !== 'IGNORE') {
        if (x2 < 0) {
          x2 = mode === 'CLAMP' ? 0 : x2 + w;
        }

        if (y2 < 0) {
          y2 = mode === 'CLAMP' ? 0 : y2 + h;
        }

        if (x2 >= w) {
          x2 = mode === 'CLAMP' ? w - 1 : x2 - w;
        }

        if (y2 >= h) {
          y2 = mode === 'CLAMP' ? h - 1 : y2 - h;
        }
      }

      var k = x2 >= 0 && x2 < w && y2 >= 0 && y2 < h ? x2 + (y2 * w) : -1;

      targetView[i] = (k && sourceView[k]) || blank;
    }

    return target
  }
};

module.exports = Crook;

