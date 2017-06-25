const canvas = document.querySelector('canvas');
const source = canvas.getContext('2d');
const lookup = canvas.cloneNode().getContext('2d');

const master = document.createElement('img');
const output = source.getImageData(0, 0, canvas.width, canvas.height);

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
    source.drawImage(master, 0, 0);
  } else {
    source.putImageData(output, 0, 0);
  }

  toggle = !toggle;
}, false);

worker.addEventListener('message', (e) => {
  output.data.set(e.data.result.data);
});

master.addEventListener('load', () => {
  source.drawImage(master, 0, 0);
  lookup.drawImage(master, 0, 0);

  worker.postMessage({
    source: source.getImageData(0, 0, canvas.width, canvas.height),
    lookup: lookup.getImageData(0, 0, canvas.width, canvas.height),
  });
});

master.setAttribute('src', '/master.jpg');

