(function () {
'use strict';

var canvas = document.querySelector('canvas');
var source = canvas.getContext('2d');
var lookup = canvas.cloneNode().getContext('2d');

var master = document.createElement('img');
var output = source.getImageData(0, 0, canvas.width, canvas.height);

var workerBlob = new Blob([document.getElementById('worker').textContent]);
var workerBlobUrl = (window.URL || window.webkitURL).createObjectURL(workerBlob);
var worker = new Worker(workerBlobUrl);

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var toggle = false;

canvas.addEventListener('click', function (e) {
  e.preventDefault();

  if (toggle) {
    source.drawImage(master, 0, 0);
  } else {
    source.putImageData(output, 0, 0);
  }

  toggle = !toggle;
}, false);

worker.addEventListener('message', function (e) {
  output.data.set(e.data.result.data);
});

master.addEventListener('load', function () {
  source.drawImage(master, 0, 0);
  lookup.drawImage(master, 0, 0);

  worker.postMessage({
    source: source.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
  });
});

master.setAttribute('src', '/master.jpg');

}());
