const TAU = Math.PI * 2
const params = [
  {
    channel: {
      x: 0,
      y: 1,
    },
    scale: {
      x: 0,
      y: -25,
    },
    mode: 1,
  },
  {
    channel: {
      x: 0,
      y: 2,
    },
    scale: {
      x: 40,
      y: 40,
    },
  },
  {
    channel: {
      x: 0,
      y: 2,
    },
    scale: {
      x: 5,
      y: 5,
    },
    mode: 1,
  },
  {
    channel: {
      x: 0,
      y: 2,
    },
    scale: {
      x: 1,
      y: 10,
    },
    mode: 2,
  },
]

const warp = (lookup) => {
  const { width: w, height: h } = lookup.canvas
  const gradH = lookup.createLinearGradient(0, 0, w, 0)

  gradH.addColorStop(0, "#000")
  gradH.addColorStop(0.5, "#fff")
  gradH.addColorStop(1, "#000")

  lookup.fillStyle = gradH
  lookup.fillRect(0, 0, w, h)
}

const zoom = (lookup) => {
  const { width: w, height: h } = lookup.canvas
  const gradH = lookup.createLinearGradient(0, 0, w, 0)

  gradH.addColorStop(0, "#f00")
  gradH.addColorStop(1, "#000")

  lookup.fillStyle = gradH
  lookup.arc(95, 70, 60, 0, TAU)
  lookup.fill()

  const gradV = lookup.createLinearGradient(0, 0, 0, h)

  gradV.addColorStop(0, "#00f")
  gradV.addColorStop(1, "#000")

  lookup.globalCompositeOperation = "screen"

  lookup.fillStyle = gradV
  lookup.arc(95, 70, 60, 0, TAU)
  lookup.fill()
}

const dust = (lookup) => {
  const { width: w, height: h } = lookup.canvas
  const area = w * h

  for (let i = 0; i < area; i += 1) {
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
    lookup.fillStyle = (i % 2) ? "#000" : "#fff"
    lookup.fillRect((i * 2), 0, 1, h)
  }
}

const boards = document.querySelectorAll("canvas")

Array.from(boards).forEach((canvas, i) => {
  const config = params[i]

  const target = canvas.getContext("2d")
  const buffer = canvas.cloneNode().getContext("2d")
  const shadow = canvas.cloneNode().getContext("2d")

  const { width: w, height: h } = canvas

  shadow.fillStyle = "rgb(128, 128, 128)"
  shadow.fillRect(0, 0, w, h)

  switch (i) {
    case 0:
      warp(shadow)
      break
    case 1:
      zoom(shadow)
      break
    case 2:
      dust(shadow)
      break
    default:
      fork(shadow)
      break
  }

  const worker = new Worker("worker.js")
  const master = document.createElement("img")

  master.addEventListener("load", () => {
    buffer.drawImage(master, 0, 0)

    const source = buffer.getImageData(0, 0, w, h)
    const lookup = shadow.getImageData(0, 0, w, h)

    worker.postMessage({ config, source, lookup })
  })

  worker.addEventListener("message", ({ data }) => {
    target.putImageData(data.result, 0, 0)
  })

  master.setAttribute("src", canvas.dataset.src)
})
