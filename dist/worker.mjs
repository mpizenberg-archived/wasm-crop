// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

// Import and initialize the WebAssembly module.
// Remark: ES modules are not supported in Web Workers,
// so you have to process this file with esbuild:
// esbuild worker.mjs --bundle --outfile=worker.js
import { crop, default as init } from "./pkg/wasm_crop.js";
init("./pkg/wasm_crop_bg.wasm");

console.log("Hello from worker");

onmessage = async function (event) {
  const url = event.data;
  console.log("Cropping in worker: " + url);
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const cropped = crop(new Uint8Array(arrayBuffer));
  const croppedUrl = URL.createObjectURL(new Blob([cropped]));
  postMessage(croppedUrl);
};
