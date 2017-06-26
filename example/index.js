(function () {
'use strict';

var canvas = document.querySelector('canvas');
var master = canvas.getContext('2d');
var lookup = canvas.cloneNode().getContext('2d');

var source = document.createElement('img');
var output = master.getImageData(0, 0, canvas.width, canvas.height);

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
    master.drawImage(source, 0, 0);
  } else {
    master.putImageData(output, 0, 0);
  }

  toggle = !toggle;
}, false);

worker.addEventListener('message', function (e) {
  output.data.set(e.data.result.data);
});

source.addEventListener('load', function () {
  master.drawImage(source, 0, 0);
  lookup.drawImage(source, 0, 0);

  worker.postMessage({
    source: master.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
  });
});

source.setAttribute('src', 'master.jpg');

}());
