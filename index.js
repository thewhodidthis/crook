'use strict';

function Crook(options) {

  // Get defaults
  var defaults = Object.create(Crook.defaults);

  // Store settings
  for (var key in defaults) {
    this[key] = (options && options[key]) || defaults[key];
  }
}

Crook.prototype = {
  constructor: Crook,

  _run: function (sourceData, lookupData) {

    // Displacement map width
    var lookupW = lookupData.width;

    // Displacement map height
    var lookupH = lookupData.height;

    // Displacement map area
    var lookupArea = lookupW * lookupH;

    // Displacement map colors
    var lookupPixels = lookupData.data;

    // Source colors rgba
    var sourcePixels = sourceData.data;

    // Source colors 32bit
    var sourceView32 = new Int32Array(sourcePixels.buffer);

    for (var y = 0; y < lookupH; y += 1) {
      for (var x = 0; x < lookupW; x += 1) {
        var targetIdx = x + y * lookupW;
        var lookupIdx = targetIdx * 4;

        // Shift amount horizontal
        var sx = x + this.getShift(lookupPixels[lookupIdx + this.channel.x], this.scale.x);

        // Shift amount vertical
        var sy = y + this.getShift(lookupPixels[lookupIdx + this.channel.y], this.scale.y);

        // Shift index
        var sourceIdx = sx + sy * lookupW;

        // Wrap around the end
        if (sourceIdx < 0) {
          sourceIdx = sourceIdx + lookupArea;
        }

        // Wrap around the beginning
        if (sourceIdx > lookupArea) {
          sourceIdx = sourceIdx % lookupArea;
        }

        // Paste in place
        sourceView32[targetIdx] = sourceView32[sourceIdx];
      }
    }

    return sourceData;
  },

  that: function (source, lookup) {

    // TODO: Check type of args, allow images?
    var sourceData = source.getImageData(0, 0, source.canvas.width, source.canvas.height);
    var lookupData = lookup.getImageData(0, 0, lookup.canvas.width, lookup.canvas.height);

    return this._run(sourceData, lookupData);
  },

  getShift: function (color, scale) {
    var ratio = (color / 0xFF * 2) - 1;
    var shift = ratio * scale | 0;

    return shift;
  }
};

Crook.defaults = {

  // Which color channel to use for calculating displacement
  // 0: Red, 1: Green, 2: Blue, 3: Alpha
  channel: {
    x: 0,
    y: 0
  },

  // The multiplier to use for scaling the x and y displacement values from the lookup calculation
  scale: {
    x: 0,
    y: 0
  }
};

module.exports = Crook;
