const canvas = document.querySelector('canvas');
const master = canvas.getContext('2d');
const lookup = canvas.cloneNode().getContext('2d');

const source = document.createElement('img');
const output = master.getImageData(0, 0, canvas.width, canvas.height);

const workerBlob = new Blob([document.getElementById('worker').textContent]);
const workerBlobUrl = (window.URL || window.webkitURL).createObjectURL(workerBlob);
const worker = new Worker(workerBlobUrl);

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

let toggle = false;

canvas.addEventListener('click', (e) => {
  e.preventDefault();

  if (toggle) {
    master.drawImage(source, 0, 0);
  } else {
    master.putImageData(output, 0, 0);
  }

  toggle = !toggle;
}, false);

worker.addEventListener('message', (e) => {
  output.data.set(e.data.result.data);
});

source.addEventListener('load', () => {
  master.drawImage(source, 0, 0);
  lookup.drawImage(source, 0, 0);

  worker.postMessage({
    source: master.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height),
  });
});

source.setAttribute('src', 'master.jpg');

