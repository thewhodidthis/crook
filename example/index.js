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

var isOn = 0;
var getRandom = function(max) {
  return Math.floor(Math.random() * max);
};

html.className = 'html';

if (window !== window.top) {
  html.className += ' is-iframe';
}

lookup.fillStyle = '#808080';
lookup.fillRect(0, 0, canvas.width, canvas.height);

for (var l = 0; l < 100; l += 1) {
  var x1 = getRandom(canvas.width);
  var x2 = getRandom(canvas.width);
  var y1 = getRandom(canvas.height);
  var y2 = getRandom(canvas.height);

  if (l % 2 === 0) {
    lookup.strokeStyle = '#f00';
  } else {
    lookup.strokeStyle = '#0f0';
  }

  lookup.lineWidth = getRandom(5) + 1;

  lookup.beginPath();
  lookup.moveTo(x1, y1);
  lookup.lineTo(x2, y2);
  lookup.stroke();
}

canvas.addEventListener('click', function _onClick(e) {
  e.preventDefault();

  if (isOn === 0) {
    source.putImageData(target, 0, 0);
  } else if (isOn === 1) {
    source.drawImage(lookup.canvas, 0, 0);
  } else if (isOn === 2) {
    source.drawImage(master, 0, 0);
  }

  isOn = (isOn + 1) % 3;
}, false);

worker.addEventListener('message', function _onDoneProcessing(e) {
  target = e.data.result;
}, false);

master.addEventListener('load', function _onLoad(e) {
  source.drawImage(master, 0, 0);

  worker.postMessage({
    source: source.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
  });
}, false);

master.setAttribute('src', '/sprite.jpg');

