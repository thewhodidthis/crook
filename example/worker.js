importScripts('./crook.js')

self.addEventListener('message', (e) => {
  const filter = crook.default(e.data.config)

  self.postMessage({
    result: filter(e.data.source, e.data.lookup)
  })
})
