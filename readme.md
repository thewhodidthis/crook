## Crook
> Helps do pixel shifting

### Setup
```sh
# Fetch latest from github
npm i thewhodidthis/crook
```

### Usage
```js

import crook from '@thewhodidthis/crook'

const source = document.createElement('img')
const target = document.createElement('img')
const buffer = document.createElement('canvas').getContext('2d')

const figure = { width: 640, height: 360 }
const canvas = Object.assign(buffer.canvas, figure)

const filter = crook({
  channel: {
    x: 1,
    y: 0
  },
  scale: {
    x: 179,
    y: 0
  }
});

source.addEventListener('load', () => {
  buffer.drawImage(source, 0, 0)

  const lookup = buffer.getImageData(0, 0, canvas.width, canvas.height)
  const result = filter(lookup, lookup)

  buffer.putImageData(result, 0, 0)
  target.setAttribute('src', canvas.toDataURL('image/jpeg'))
})

source.setAttribute('crossOrigin', 'anonymous')
source.setAttribute('src', `//source.unsplash.com/random/${figure.width}x${figure.height}`)
```
