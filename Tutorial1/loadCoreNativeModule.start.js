// This is the starting point for the tutorial.
// You will add code to this file to make the tests in loadCoreNativeModule.test.js pass.
// Or you can just read the loadCoreNativeModule.solution.js file

import ffi from 'ffi-napi'; // 'ffi-napi' is used to load and call functions from native libraries.
import path from 'path'; // 'path' is used for working with file and directory paths.
import fs from 'fs'; // 'fs' is used for interacting with the file system.
import { fileURLToPath } from 'url';

export function loadCoreNativeModule(core_path) {
  // In ES modules, __dirname is not available directly. We can derive it from import.meta.url.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Tutorial Task: load the core as a native module using ffi-napi

  return null;
}
