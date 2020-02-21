## Crook
> For displacement mapping

### Setup
```sh
# Fetch latest from github
npm i thewhodidthis/crook
```

### Usage
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
