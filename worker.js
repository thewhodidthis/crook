importScripts("./crook.js")

self.addEventListener("message", ({ data }) => {
  const filter = crook(data.config)

  self.postMessage({ result: filter(data.source, data.lookup) })
})
