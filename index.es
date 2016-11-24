function Crook(options) {
  // Set options
  this.options = Object.assign({}, Crook.defaults, options);
  this.channel = this.options.channel;
  this.scale = this.options.scale;
}

Crook.prototype = {
  constructor: Crook,

  run(sourceData, lookupData) {
    // Displacement map width
    const lookupW = lookupData.width;

    // Displacement map height
    const lookupH = lookupData.height;

    // Displacement map area
    const lookupArea = lookupW * lookupH;

    // Displacement map colors
    const lookupPixels = lookupData.data;

    // Source colors rgba
    const sourcePixels = sourceData.data;

    // Source colors 32bit
    const sourceView32 = new Int32Array(sourcePixels.buffer);

    // Output buffer
    const target = new ArrayBuffer(sourcePixels.length);
    const targetPixels = new Uint8ClampedArray(target);
    const targetView32 = new Int32Array(target);

    for (let y = 0; y < lookupH; y += 1) {
      for (let x = 0; x < lookupW; x += 1) {
        const targetIdx = x + (y * lookupW);
        const lookupIdx = targetIdx * 4;

        // Shift amount horizontal
        const sx = x + this.getShift(lookupPixels[lookupIdx + this.channel.x], this.scale.x);

        // Shift amount vertical
        const sy = y + this.getShift(lookupPixels[lookupIdx + this.channel.y], this.scale.y);

        // Shift index
        let sourceIdx = sx + (sy * lookupW);

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

  that(source, lookup) {
    // TODO: Check type of args, allow images?
    const sourceData = source.getImageData(0, 0, source.canvas.width, source.canvas.height);
    const lookupData = lookup.getImageData(0, 0, lookup.canvas.width, lookup.canvas.height);

    return this.run(sourceData, lookupData);
  },

  getShift(color, scale) {
    return Math.floor((scale * ((color / 0xFF) * 2)) - 1);
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

export default Crook;
