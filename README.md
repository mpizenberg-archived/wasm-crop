# wasm-crop

This is a demo crate, just to show how to perform image cropping in WebAssembly in a Web worker, based on the image crate.

```sh
wasm-pack build --target web -- --features console_error_panic_hook
```

And inside `dist/`:

```sh
esbuild worker.mjs --bundle --outfile=worker.js
```
