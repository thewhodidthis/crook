const pixel = new ImageData(1, 1)
const point = { x: 0, y: 0 }
const blank = [0, 0, 0, 255]

const clamp = (v, max) => (v >= max ? max - 1 : Math.max(v, 0))
const pleat = (v, max) => (v >= max || v < 0 ? v + (max * Math.sign(v)) : v)
const skirt = (v, max) => (v >= max || v < 0 ? NaN : v)

const shift = (color, scale) => {
  const ratio = scale * (color - 128) / 256

  return Math.sign(ratio) * Math.round(Math.abs(ratio))
}

const crook = ({ channel = point, scale = point, mode = 0 } = {}) => {
  // Wrap how?
  const round = mode ? mode === 1 ? clamp : pleat : skirt

  // Expects and returns `ImageData`
  return (source = pixel, { width: w, height: h, data: lookup } = pixel) => {
    const target = new ImageData(w, h)
    const targetView = new Int32Array(target.data.buffer)
    const sourceView = new Int32Array(source.data.buffer)

    for (let i = 0, max = w * h; i < max; i += 1) {
      const j = i * 4

      const x = i % w
      const y = Math.floor(i / w)

      const x1 = x + shift(lookup[j + channel.x], scale.x)
      const y1 = y + shift(lookup[j + channel.y], scale.y)

      const x2 = round(x1, w)
      const y2 = round(y1, h)

      const k = x2 + (y2 * w)

      targetView[i] = k >= 0 ? sourceView[k] : blank
    }

    return target
  }
}

export default crook
