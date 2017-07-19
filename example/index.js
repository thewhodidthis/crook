(function () {
'use strict';

var TAU = Math.PI * 2;

var images = document.querySelectorAll('canvas img');
var boards = document.querySelectorAll('canvas');

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var params = [
  {
    channel: {
      x: 0,
      y: 1
    },
    scale: {
      x: 0,
      y: -25
    },
    mode: 1
  },
  {
    channel: {
      x: 0,
      y: 2
    },
    scale: {
      x: 40,
      y: 40
    }
  },
  {
    channel: {
      x: 0,
      y: 2
    },
    scale: {
      x: 5,
      y: 5
    },
    mode: 1
  },
  {
    channel: {
      x: 0,
      y: 2
    },
    scale: {
      x: 1,
      y: 10
    },
    mode: 2
  }
];

var warp = function (lookup) {
  var ref = lookup.canvas;
  var w = ref.width;
  var h = ref.height;
  var gradient = lookup.createLinearGradient(0, 0, w, 0);

  gradient.addColorStop(0, '#000');
  gradient.addColorStop(0.5, '#fff');
  gradient.addColorStop(1, '#000');

  lookup.fillStyle = gradient;
  lookup.fillRect(0, 0, w, h);
};

var zoom = function (lookup) {
  var ref = lookup.canvas;
  var w = ref.width;
  var h = ref.height;
  var gradH = lookup.createLinearGradient(0, 0, w, 0);

  gradH.addColorStop(0, '#f00');
  gradH.addColorStop(1, '#000');

  lookup.fillStyle = gradH;
  lookup.arc(95, 70, 60, 0, TAU);
  lookup.fill();

  var gradV = lookup.createLinearGradient(0, 0, 0, h);

  gradV.addColorStop(0, '#00f');
  gradV.addColorStop(1, '#000');

  lookup.globalCompositeOperation = 'screen';

  lookup.fillStyle = gradV;
  lookup.arc(95, 70, 60, 0, TAU);
  lookup.fill();
};

var noiz = function (lookup) {
  var ref = lookup.canvas;
  var w = ref.width;
  var h = ref.height;

  for (var i = 0, area = w * h; i < area; i += 1) {
    var x = i % w;
    var y = Math.floor(i / w);
    var c = Math.floor(Math.random() * 255);

    lookup.fillStyle = "rgba(" + c + ", " + c + ", " + c + ", " + c + ")";
    lookup.fillRect(x, y, 1, 1);
  }
};

var fork = function (lookup) {
  var h = lookup.canvas.height;

  for (var i = 0; i < 90; i += 1) {
    lookup.fillStyle = (i % 2) ? '#000' : '#fff';
    lookup.fillRect((i * 2), 0, 1, h);
  }
};

Array.from(images).map(function (img) { return img.alt; }).forEach(function (file, i) {
  var config = params[i];
  var canvas = boards[i];
  var master = canvas.getContext('2d');
  var lookup = canvas.cloneNode().getContext('2d');

  var worker = new Worker('worker.js');
  var source = document.createElement('img');

  lookup.fillStyle = 'rgb(128, 128, 128)';
  lookup.fillRect(0, 0, canvas.width, canvas.height);

  switch (i) {
  case 0:
    warp(lookup);
    break
  case 1:
    zoom(lookup);
    break
  case 2:
    noiz(lookup);
    break
  default:
    fork(lookup);
    break
  }

  worker.addEventListener('message', function (e) {
    master.putImageData(e.data.result, 0, 0);
  });

  source.addEventListener('load', function () {
    master.drawImage(source, 0, 0);

    worker.postMessage({
      config: config,
      source: master.getImageData(0, 0, canvas.width, canvas.height),
      lookup: lookup.getImageData(0, 0, canvas.width, canvas.height)
    });
  });

  source.setAttribute('src', file);
});

}());

