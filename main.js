// # Crook
// Helps with pixel shifting

// Clamps the displacement value to the edge of the source image.
const clamp = (v, max) => (v >= max ? max - 1 : Math.max(v, 0))

// Wraps the displacement value to the other side of the source image.
const pleat = (v, max) => (v >= max || v < 0 ? v + (max * Math.sign(v)) : v)

// Ignores the math and allows for using the source pixel if the displacement value is out of range.
const skirt = (v, max) => (v >= max || v < 0 ? NaN : v)

// Color shift above and below gray.
const shift = (color, scale) => {
  const ratio = 0.00390625 * scale * (color - 128)

  return Math.sign(ratio) * Math.round(Math.abs(ratio))
}

// Extract options for color channel, scaling across each axis, edge work type.
export default function crook({ channel = { x: 0, y: 0 }, scale = channel, mode = 0 } = {}) {
  // Wrap how?
  const round = mode ? mode === 1 ? clamp : pleat : skirt

  // Expects and returns an `ImageData` like object plus a color map of similar type.
  return function filter(target = { data: [], width: 0, height: 0 }, lookup = target) {
    const bitmap = new Int32Array(target.data.buffer)
    const mirror = new Int32Array(bitmap)

    // Extract color map dimensions.
    const { width: w, height: h } = lookup

    for (let i = 0, stop = w * h; i < stop; i += 1) {
      // In steps of four - r/g/b/a.
      const j = i * 4

      // Calculate pixel coords.
      const x = i % w
      const y = Math.floor(i / w)

      // Process coords.
      const x1 = x + shift(lookup.data[j + channel.x], scale.x)
      const y1 = y + shift(lookup.data[j + channel.y], scale.y)

      const x2 = round(x1, w)
      const y2 = round(y1, h)

      // Find color map index at pixel coords.
      const k = x2 + (y2 * w)

      // Replace input data with color map data at index, or a blank pixel if index negative or `NaN`.
      bitmap[i] = k >= 0 ? mirror[k] : 0
    }

    return target
  }
}
