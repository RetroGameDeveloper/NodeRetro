// Import necessary modules.
// 'ffi-napi' is used to load and call functions from native libraries.
// 'path' is used for working with file and directory paths.
// 'fs' is used for interacting with the file system.
// 'url' is used to get the current file's path, which is needed in ES modules.
import ffi from 'ffi-napi';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export function loadCoreNativeModule(core_path) {
  // In ES modules, __dirname is not available directly. We can derive it from import.meta.url.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Determine the correct shared library file based on the operating system.
  // The library name is different for Windows (.dll), macOS (.dylib), and Linux (.so).
  const libraryFile = {
      'win32': core_path+'.dll',
      'darwin': core_path+'.dylib',
      'linux': core_path+'.so'
  }[process.platform];

  // If the platform is not supported, throw an error.
  if (!libraryFile) {
      throw new Error(`Unsupported platform: ${process.platform}`);
  }

  // Construct the full path to the library file.
  const libraryPath = path.join(__dirname, libraryFile);

  // Check if the library file actually exists at the constructed path.
  // If not, throw an error to prevent ffi-napi from failing silently.
  if (!fs.existsSync(libraryPath)) {
    throw new Error(`Core not found at ${libraryPath}`);
  }

  // Load the native library from the specified path.
  // ffi.Library takes the library path and an object defining the functions to import.
   const lib = ffi.Library(libraryPath, {
    // 'retro_api_version' is the name of the function in the native library.
    // The value is an array where the first element is the return type ('int' for integer)
    // and the second element is an array of argument types (empty for no arguments).
    'retro_api_version': ['int', []]
  });

  return lib;
}