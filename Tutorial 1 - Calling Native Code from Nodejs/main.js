// main.js
const ffi = require('ffi-napi');
const path = require('path');

// Determine the correct library path based on the platform
const libraryFile = {
    'win32': 'cores/gambatte_libretro.dll',
    'darwin': 'cores/gambatte_libretro.dylib',
    'linux': 'cores/gambatte_libretro.so'
}[process.platform];

if (!libraryFile) {
    throw new Error(`Unsupported platform: ${process.platform}`);
}

const libraryPath = path.join(__dirname, libraryFile);

// Load the library
const lib = ffi.Library(libraryPath, {
  'retro_api_version': ['int', []]
});

const result = lib.retro_api_version();
console.log("API Version:",result)