## about

Implements [displacement mapping](https://help.adobe.com/en_US/as3/dev/WS5b3ccc516d4fbf351e63e3d118a9b90204-7da2.html) in a web worker friendly manner.

## setup

Fetch latest from GitHub directly,

```sh
# Includes ESM and CJS versions
npm i thewhodidthis/crook
```

## usage

Mapping a random image onto itself,

```js
import bender from '@thewhodidthis/crook'

const source = document.createElement('img')
const target = document.createElement('img')
const buffer = document.createElement('canvas').getContext('2d')

const canvas = Object.assign(buffer.canvas, { width: 180, height: 180 })

const filter = bender({
  channel: {
    x: 1,
    y: 0
  },
  scale: {
    x: canvas.width,
    y: 0
  }
})

source.addEventListener('load', () => {
  buffer.drawImage(source, 0, 0)

  const pixels = buffer.getImageData(0, 0, canvas.width, canvas.height)
  const result = filter(pixels, pixels)

  buffer.putImageData(result, 0, 0)

  const output = canvas.toDataURL('image/jpeg')

  target.setAttribute('src', output)
})

source.setAttribute('crossOrigin', 'anonymous')
source.setAttribute('src', `//source.unsplash.com/random/${canvas.width}x${canvas.height}`)
```

## see also

- [Pixel bending with butter and crook](https://thewhodidthis.com/pixel-bending-with-butter-and-crook/)
