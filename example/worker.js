importScripts('crook.js');

self.addEventListener('message', (e) => {
  const filter = Crook({
    channel: {
      x: 1,
      y: 0,
    },
    scale: {
      x: 320,
      y: -360,
    },
  });

  self.postMessage({ result: filter(e.data.source, e.data.lookup) });
});

