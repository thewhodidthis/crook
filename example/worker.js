importScripts('crook.js');

self.addEventListener('message', function (e) {
  var filter = Crook(e.data.config);

  self.postMessage({ result: filter(e.data.source, e.data.lookup) });
});

