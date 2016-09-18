'use strict';

var html = document.documentElement;

var canvas = document.getElementById('canvas');
var source = canvas.getContext('2d');
var lookup = canvas.cloneNode().getContext('2d');
var master = document.createElement('img');
var output = source.getImageData(0, 0, canvas.width, canvas.height);

var workerBlob = new Blob([document.getElementById('worker').textContent]);
var workerBlobUrl = (window.URL || window.webkitURL).createObjectURL(workerBlob);
var worker = new Worker(workerBlobUrl);

var isOn = 0;

html.className = 'html';

if (window !== window.top) {
  html.className += ' is-iframe';
}

canvas.addEventListener('click', function _onClick(e) {
  e.preventDefault();

  if (isOn) {
    source.drawImage(master, 0, 0);
  } else {
    source.putImageData(output, 0, 0);
  }

  isOn = !isOn;
}, false);

worker.addEventListener('message', function _onDoneProcessing(e) {
  output.data.set(e.data.result);
}, false);

master.addEventListener('load', function _onLoad(e) {
  source.drawImage(master, 0, 0);
  lookup.drawImage(master, 0, 0);

  worker.postMessage({
    source: source.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
  });
}, false);

master.setAttribute('src', '/master.jpg');

