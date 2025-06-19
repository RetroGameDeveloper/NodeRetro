// main.js
// This script demonstrates how to call a native function from a shared library (.dll, .so, .dylib) using Node.js and the ffi-napi package.

// To try the task yourself use:
import {loadCoreNativeModule} from './loadCoreNativeModule.start.js'
// Otherwise just switch it with the solution:
// import {loadCoreNativeModule} from './loadCoreNativeModule.solution.js'


export function main() {
  const lib = loadCoreNativeModule('../cores/gambatte_libretro');
  // Call the 'retro_api_version' function from the loaded library.
  const result = lib.retro_api_version();
  console.log("API Version:", result);
}
main();