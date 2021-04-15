const file_input = document.getElementById("file-input");
const img_dom = document.getElementById("the-img");
const file_reader = new FileReader();
file_input.onchange = () => loadInput();
start();

function loadInput() {
  const file = file_input.files[0];
  file_reader.readAsArrayBuffer(file);
}

async function start() {
  // Initialize the wasm module.
  let worker = new Worker("worker.js");

  // Update the image when we get a response from worker.
  worker.onmessage = async function (event) {
    // URL.revokeObjectURL(img_dom.src);
    img_dom.src = event.data;

    // // TEMP
    // let img_temp = new Image();
    // img_temp.src = cropped_url;
    // await img_temp.decode();
  };

  // Crop image when it is loaded.
  file_reader.onload = async function () {
    // Temporarily display the original image.
    let original_url = URL.createObjectURL(new Blob([file_reader.result]));
    img_dom.src = original_url;
    await sleep(1000);

    // Crop the image in the worker.
    let cropped = worker.postMessage(original_url);
  };
}

// Small utility function.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
