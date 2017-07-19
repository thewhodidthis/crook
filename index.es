const v2 = { x: 0, y: 0 }
const blank = [0, 0, 0, 255]
const modes = ['IGNORE', 'CLAMP', 'WRAP']

const shift = (color, scale) => {
  const ratio = scale * (color - 128) / 256

  return Math.sign(ratio) * Math.round(Math.abs(ratio))
}

const Crook = (options) => {
  const { channel, scale, mode: type } = Object.assign({
    // Which color channel to use for calculating displacement
    // 0: Red, 1: Green, 2: Blue, 3: Alpha
    channel: v2,

    // The multiplier to use for scaling the x and y displacement
    // values from the lookup calculation
    scale: v2,

    // Do what with empty pixels?
    mode: 0
  }, options)

  const mode = modes[parseInt(type, 10) % modes.length]

  // Expects and returns `ImageData`
  return (source, { width: w, height: h, data: lookup } = ImageData) => {
    const target = new ImageData(source.width, source.height)
    const targetView = new Int32Array(target.data.buffer)
    const sourceView = new Int32Array(source.data.buffer)

    for (let i = 0, max = w * h; i < max; i += 1) {
      const j = i * 4

      const x1 = i % w
      const y1 = Math.floor(i / w)

      let x2 = x1 + shift(lookup[j + channel.x], scale.x)
      let y2 = y1 + shift(lookup[j + channel.y], scale.y)

      if (mode !== 'IGNORE') {
        if (x2 < 0) {
          x2 = mode === 'CLAMP' ? 0 : x2 + w
        }

        if (y2 < 0) {
          y2 = mode === 'CLAMP' ? 0 : y2 + h
        }

        if (x2 >= w) {
          x2 = mode === 'CLAMP' ? w - 1 : x2 - w
        }

        if (y2 >= h) {
          y2 = mode === 'CLAMP' ? h - 1 : y2 - h
        }
      }

      const k = x2 >= 0 && x2 < w && y2 >= 0 && y2 < h ? x2 + (y2 * w) : -1

      targetView[i] = (k && sourceView[k]) || blank
    }

    return target
  }
}

export default Crook
