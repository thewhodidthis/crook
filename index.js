'use strict';

var v2 = { x: 0, y: 0 };
var shift = function shift(color, scale) {
  return Math.floor(scale * (color / 0xFF * 2) - 1);
};

var Crook = function Crook(options) {
  var settings = Object.assign({
    // Which color channel to use for calculating displacement
    // 0: Red, 1: Green, 2: Blue, 3: Alpha
    channel: v2,

    // The multiplier to use for scaling the x and y displacement values from the lookup calculation
    scale: v2
  }, options);

  // Expects and churns out `ImageData`
  return function (source, lookup) {
    // Displacement map
    var lookupW = lookup.width;
    var lookupH = lookup.height;
    var lookupArea = lookupW * lookupH;
    var lookupData = lookup.data;

    // Source pixels
    var sourceW = source.width;
    var sourceH = source.height;
    var sourceView32 = new Int32Array(source.data.buffer);

    // Output pixels
    var target = new ImageData(sourceW, sourceH);
    var targetView32 = new Int32Array(target.data.buffer);

    for (var y = 0; y < lookupH; y += 1) {
      for (var x = 0; x < lookupW; x += 1) {
        var targetIdx = x + y * lookupW;
        var lookupIdx = targetIdx * 4;

        // Shift amount horizontal
        var sx = x + shift(lookupData[lookupIdx + settings.channel.x], settings.scale.x);

        // Shift amount vertical
        var sy = y + shift(lookupData[lookupIdx + settings.channel.y], settings.scale.y);

        // Shift index
        var sourceIdx = sx + sy * lookupW;

        // Wrap around the end
        if (sourceIdx < 0) {
          sourceIdx += lookupArea;
        }

        // Wrap around the beginning
        if (sourceIdx > lookupArea) {
          sourceIdx %= lookupArea;
        }

        // Paste in place
        targetView32[targetIdx] = sourceView32[sourceIdx];
      }
    }

    return target;
  };
};

module.exports = Crook;
