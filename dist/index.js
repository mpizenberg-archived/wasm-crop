import { Cropper, greet, default as init } from "./pkg/wasm_crop.js";

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
  const cropper = Cropper.new();
  greet("Matthieu");

  // Crop image when it is loaded.
  file_reader.onload = () => {
    let buffer = new Uint8Array(file_reader.result);
    console.log("before cropped: ", buffer);
    let cropped = cropper.crop(buffer);
    console.log("after cropped: ", cropped);
    let cropped_blob = new Blob(cropped);
    let url = URL.createObjectURL(cropped_blob);
    img_dom.src = url;
  };
}
