// SPDX-License-Identifier: MPL-2.0

use image::GenericImageView;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Macro console_log! similar to println!
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn greet(who: &str) {
    set_panic_hook();
    console_log!("Hello, {}!", who);
}

#[wasm_bindgen]
pub struct Cropper {
    cropped_img_buffer: Vec<u8>,
}

// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl Cropper {
    pub fn new() -> Cropper {
        Cropper {
            cropped_img_buffer: Vec::new(),
        }
    }

    pub fn crop(&mut self, file: &[u8]) -> Box<[u8]> {
        console_log!("cropping!");
        let mut reader = image::io::Reader::new(Cursor::new(file))
            .with_guessed_format()
            .expect("Cursor io never fails");
        let image = reader.decode().expect("Error decoding the image");
        let new_width = image.width() / 2;
        let new_height = image.height() / 2;
        let cropped_image = image.crop_imm(0, 0, new_width, new_height);
        let mut cropped_buffer: Vec<u8> = Vec::new();
        cropped_image
            .write_to(&mut cropped_buffer, image::ImageOutputFormat::Png)
            .expect("Error encoding the cropped image to PNG");
        cropped_buffer.into_boxed_slice()
    }
}
