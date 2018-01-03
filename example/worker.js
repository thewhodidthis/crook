importScripts('filter.js')

self.addEventListener('message', (e) => {
  const filter = crook(e.data.config)

  self.postMessage({
    result: filter(e.data.source, e.data.lookup)
  })
})
