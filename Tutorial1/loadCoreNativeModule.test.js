
// import { loadCoreNativeModule } from './loadCoreNativeModule.start.js';

// Determine the module path based on the 'SOLUTION' environment variable
const modulePath = process.env.SOLUTION
  ? './loadCoreNativeModule.solution.js'
  : './loadCoreNativeModule.start.js';

// Dynamically import the selected module
const { loadCoreNativeModule } = await import(modulePath);

describe('Native Library Integration', () => {
  // Test 1: Check if the library is loaded and exported.
  // This test will pass once you have correctly set up the ffi.Library call
  // and exported the 'lib' object from 'main.js'.
  test('should load and export the native library object', () => {
    const lib = loadCoreNativeModule('../cores/gambatte_libretro');
    expect(lib).toBeDefined();
    expect(typeof lib).toBe('object');
    expect(lib).not.toBeNull();
  });

  // Test 2: Check if the 'retro_api_version' function exists on the library object.
  // This test will pass once you define the 'retro_api_version' function
  // in the ffi.Library call with the correct signature.
  test('should have the retro_api_version function', () => {
    // Now, we check if the exported library has the function we need.
    // This test will fail until you correctly define the function in the ffi.Library options.
    const lib = loadCoreNativeModule('../cores/gambatte_libretro');
    expect(lib.retro_api_version).toBeDefined();
    expect(typeof lib.retro_api_version).toBe('function');
  });

  // Test 3: Check if calling 'retro_api_version' returns the correct value.
  // This test verifies that the native function call works and returns the expected API version.
  // The Libretro API version should be 1.
  test('retro_api_version() should return 1', () => {
    // Finally, we call the function and check its return value.
    // This confirms that the communication with the native library is working correctly.
    const lib = loadCoreNativeModule('../cores/gambatte_libretro');
    const apiVersion = lib.retro_api_version();
    expect(typeof apiVersion).toBe('number');
    expect(apiVersion).toBe(1);
  });
});