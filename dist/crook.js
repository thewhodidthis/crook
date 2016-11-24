var Crook = (function () {
  'use strict';

  function Crook(options) {
    // Set options
    this.options = Object.assign({}, Crook.defaults, options);
    this.channel = this.options.channel;
    this.scale = this.options.scale;
  }

  Crook.prototype = {
    constructor: Crook,

    run: function run(sourceData, lookupData) {
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

      // Output buffer
      var target = new ArrayBuffer(sourcePixels.length);
      var targetPixels = new Uint8ClampedArray(target);
      var targetView32 = new Int32Array(target);

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

      return targetPixels;
    },
    that: function that(source, lookup) {
      // TODO: Check type of args, allow images?
      var sourceData = source.getImageData(0, 0, source.canvas.width, source.canvas.height);
      var lookupData = lookup.getImageData(0, 0, lookup.canvas.width, lookup.canvas.height);

      return this.run(sourceData, lookupData);
    },
    getShift: function getShift(color, scale) {
      return Math.floor(scale * (color / 0xFF * 2) - 1);
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

  return Crook;

}());
//# sourceMappingURL=crook.js.map
