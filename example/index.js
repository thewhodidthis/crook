'use strict';

var html = document.documentElement;

var canvas = document.getElementById('canvas');
var source = canvas.getContext('2d');
var lookup = canvas.cloneNode().getContext('2d');

var target = source.getImageData(0, 0, canvas.width, canvas.height);
var master = document.createElement('img');

var workerBlob = new Blob([document.getElementById('worker').textContent]);
var workerBlobUrl = (window.URL || window.webkitURL).createObjectURL(workerBlob);
var worker = new Worker(workerBlobUrl);

var isOn = false;
var rows = 360;
var cols = 160;
var size = {
  x: 4,
  y: 1
};

html.className = 'html';

if (window !== window.top) {
  html.className += ' is-iframe';
}

lookup.fillStyle = '#808080';
lookup.fillRect(0, 0, canvas.width, canvas.height);

// TODO: draw random lines instead
for (var row = 0; row < rows; row += 1) {
  for (var col = 0; col < cols; col += 1) {
    var x = col * size.x;
    var y = row * size.y;

    if (row % 2 === 0) {
      if (col % 2 === 0) {
        lookup.fillStyle = '#808080';
      } else {
        lookup.fillStyle = '#0f0';
      }
    } else {
      if (col % 2 === 0) {
        lookup.fillStyle = '#f00';
      } else {
        lookup.fillStyle = '#808080';
      }
    }

    lookup.fillRect(x, y, size.x, size.y);
  }
}

canvas.addEventListener('click', function _onClick(e) {
  e.preventDefault();

  if (isOn) {
    source.drawImage(lookup.canvas, 0, 0);

    isOn = false;
  } else {
    source.putImageData(target, 0, 0);

    isOn = true;
  }
}, false);

worker.addEventListener('message', function _onDoneProcessing(e) {
  target.data.set(e.data.result);
  source.putImageData(target, 0, 0);

  isOn = true;
}, false);

master.addEventListener('load', function _onLoad(e) {
  source.drawImage(master, 0, 0);

  worker.postMessage({
    source: source.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
  });
}, false);

master.setAttribute('src', '/sprite.jpg');

