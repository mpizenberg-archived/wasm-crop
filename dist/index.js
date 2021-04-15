import { crop, default as init } from "./pkg/wasm_crop.js";

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
  const wasm = await init("./pkg/wasm_crop_bg.wasm");

  // Crop image when it is loaded.
  file_reader.onload = async function () {
    // Temporarily display the original image.
    let original_url = URL.createObjectURL(new Blob([file_reader.result]));
    img_dom.src = original_url;
    await sleep(1000);

    // Crop the image.
    let cropped = crop(new Uint8Array(file_reader.result));

    // Display the cropped image.
    let cropped_url = URL.createObjectURL(new Blob([cropped]));
    img_dom.src = cropped_url;

    // TEMP
    let img_temp = new Image();
    img_temp.src = cropped_url;
    await img_temp.decode();

    URL.revokeObjectURL(original_url);
  };
}

// Small utility function.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
