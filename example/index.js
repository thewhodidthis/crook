'use strict';

var html = document.documentElement;

var canvas = document.getElementById('canvas');
var target = canvas.getContext('2d');

var lookup = document.createElement('canvas').getContext('2d');
var source = document.createElement('canvas').getContext('2d');
var sprite = document.createElement('img');

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

var targetData = target.getImageData(0, 0, canvas.width, canvas.height);
var targetPixels = targetData.data;

html.className = 'html';

if (window !== window.top) {
  html.className += ' is-iframe';
}

lookup.canvas.width = source.canvas.width = canvas.width;
lookup.canvas.height = source.canvas.height = canvas.height;

lookup.fillStyle = '#808080';
lookup.fillRect(0, 0, lookup.canvas.width, lookup.canvas.height);

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
    target.drawImage(lookup.canvas, 0, 0);

    isOn = false;
  } else {
    targetData.data.set(targetPixels);
    target.putImageData(targetData, 0, 0);

    isOn = true;
  }
}, false);

worker.addEventListener('message', function _onDoneProcessing(e) {
  targetPixels = e.data.result;

  targetData.data.set(targetPixels);
  target.putImageData(targetData, 0, 0);

  isOn = true;
}, false);

sprite.addEventListener('load', function _onLoad(e) {
  source.drawImage(sprite, 0, 0);

  worker.postMessage({
    source: source.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
  });
}, false);

sprite.setAttribute('src', '/sprite.jpg');

