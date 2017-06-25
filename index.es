const v2 = { x: 0, y: 0 };
const shift = (color, scale) => Math.floor((scale * ((color / 0xFF) * 2)) - 1);

const Crook = (options) => {
  const settings = Object.assign({
    // Which color channel to use for calculating displacement
    // 0: Red, 1: Green, 2: Blue, 3: Alpha
    channel: v2,

    // The multiplier to use for scaling the x and y displacement values from the lookup calculation
    scale: v2,
  }, options);

  // Expects and churns out `ImageData`
  return (source, lookup) => {
    // Displacement map
    const lookupW = lookup.width;
    const lookupH = lookup.height;
    const lookupArea = lookupW * lookupH;
    const lookupData = lookup.data;

    // Source pixels
    const sourceW = source.width;
    const sourceH = source.height;
    const sourceView32 = new Int32Array(source.data.buffer);

    // Output pixels
    const target = new ImageData(sourceW, sourceH);
    const targetView32 = new Int32Array(target.data.buffer);

    for (let y = 0; y < lookupH; y += 1) {
      for (let x = 0; x < lookupW; x += 1) {
        const targetIdx = x + (y * lookupW);
        const lookupIdx = targetIdx * 4;

        // Shift amount horizontal
        const sx = x + shift(lookupData[lookupIdx + settings.channel.x], settings.scale.x);

        // Shift amount vertical
        const sy = y + shift(lookupData[lookupIdx + settings.channel.y], settings.scale.y);

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

    return target;
  };
};

export default Crook;

