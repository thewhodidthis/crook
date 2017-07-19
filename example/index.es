const TAU = Math.PI * 2

const images = document.querySelectorAll('canvas img')
const boards = document.querySelectorAll('canvas')

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const params = [
  {
    channel: {
      x: 0,
      y: 1
    },
    scale: {
      x: 0,
      y: -25
    },
    mode: 1
  },
  {
    channel: {
      x: 0,
      y: 2
    },
    scale: {
      x: 40,
      y: 40
    }
  },
  {
    channel: {
      x: 0,
      y: 2
    },
    scale: {
      x: 5,
      y: 5
    },
    mode: 1
  },
  {
    channel: {
      x: 0,
      y: 2
    },
    scale: {
      x: 1,
      y: 10
    },
    mode: 2
  }
]

const warp = (lookup) => {
  const { width: w, height: h } = lookup.canvas
  const gradient = lookup.createLinearGradient(0, 0, w, 0)

  gradient.addColorStop(0, '#000')
  gradient.addColorStop(0.5, '#fff')
  gradient.addColorStop(1, '#000')

  lookup.fillStyle = gradient
  lookup.fillRect(0, 0, w, h)
}

const zoom = (lookup) => {
  const { width: w, height: h } = lookup.canvas
  const gradH = lookup.createLinearGradient(0, 0, w, 0)

  gradH.addColorStop(0, '#f00')
  gradH.addColorStop(1, '#000')

  lookup.fillStyle = gradH
  lookup.arc(95, 70, 60, 0, TAU)
  lookup.fill()

  const gradV = lookup.createLinearGradient(0, 0, 0, h)

  gradV.addColorStop(0, '#00f')
  gradV.addColorStop(1, '#000')

  lookup.globalCompositeOperation = 'screen'

  lookup.fillStyle = gradV
  lookup.arc(95, 70, 60, 0, TAU)
  lookup.fill()
}

const noiz = (lookup) => {
  const { width: w, height: h } = lookup.canvas

  for (let i = 0, area = w * h; i < area; i += 1) {
    const x = i % w
    const y = Math.floor(i / w)
    const c = Math.floor(Math.random() * 255)

    lookup.fillStyle = `rgba(${c}, ${c}, ${c}, ${c})`
    lookup.fillRect(x, y, 1, 1)
  }
}

const fork = (lookup) => {
  const h = lookup.canvas.height

  for (let i = 0; i < 90; i += 1) {
    lookup.fillStyle = (i % 2) ? '#000' : '#fff'
    lookup.fillRect((i * 2), 0, 1, h)
  }
}

Array.from(images).map(img => img.alt).forEach((file, i) => {
  const config = params[i]
  const canvas = boards[i]
  const master = canvas.getContext('2d')
  const lookup = canvas.cloneNode().getContext('2d')

  const worker = new Worker('worker.js')
  const source = document.createElement('img')

  lookup.fillStyle = 'rgb(128, 128, 128)'
  lookup.fillRect(0, 0, canvas.width, canvas.height)

  switch (i) {
  case 0:
    warp(lookup)
    break
  case 1:
    zoom(lookup)
    break
  case 2:
    noiz(lookup)
    break
  default:
    fork(lookup)
    break
  }

  worker.addEventListener('message', (e) => {
    master.putImageData(e.data.result, 0, 0)
  })

  source.addEventListener('load', () => {
    master.drawImage(source, 0, 0)

    worker.postMessage({
      config,
      source: master.getImageData(0, 0, canvas.width, canvas.height),
      lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
    })
  })

  source.setAttribute('src', file)
})
