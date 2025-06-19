# NodeRetro - Tutorial 1 - Calling Native Code From Nodejs

Please make sure you have followed the initial setup guide in the root README.md before following this tutorial.

---
## Introduction
All the libRetro cores are compiled as native libraries (.dll on Windows, .dylib on MacosX, .so on Linux), we need to be able to call the fucntions in these cores in order to have a functioning libRetro Frontend.

First we need to install the Node package that allows you to interface with dynamic libraries using Foreign Function Interface (FFI) Native API:
```
npm install ffi-napi ref-napi
```

---
## Tutorial Steps

This tutorial will guide you through modifying the [`loadCoreNativeModule.start.js`](Tutorial%201%20-%20Calling%20Native%20Code%20from%20Nodejs/loadCoreNativeModule.start.js) file to correctly load a native libretro core. The goal is to make the tests in `loadCoreNativeModule.test.js` pass which will mean you have successfully loaded a native libRetro core and executed one of its functions!

First make sure you can run the tests which should fail:
```bash
npm test Tutorial1
```

Open the file [`Tutorial 1 - Calling Native Code from Nodejs/loadCoreNativeModule.start.js`](Tutorial%201%20-%20Calling%20Native%20Code%20from%20Nodejs/loadCoreNativeModule.start.js). You'll see a function `loadCoreNativeModule` that currently returns `null`. We will add code to this function.

### Step 1: Determine the correct library file for the OS

Native shared libraries have different file extensions depending on the operating system:
-   **Windows:** `.dll`
-   **macOS:** `.dylib`
-   **Linux:** `.so`

We need to determine the correct file extension based on the current operating system. Node.js provides the `process.platform` property which tells us which platform Node.js was compiled for ('win32', 'darwin', 'linux', etc.).

Add the following code inside the `loadCoreNativeModule` function to determine the correct library filename:

```javascript
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
```
This code creates a `libraryFile` variable that holds the correct filename with extension by looking up the current platform in an object. It also includes a check for unsupported platforms.

### Step 2: Construct the full path to the library

Now that we have the correct filename, we need to construct the full path to it. The `core_path` argument is the path to the core, and `__dirname` is the directory of the current module. We can use the `path.join()` method to combine them to create a full, platform-safe path.

Add this code after the platform check:

```javascript
  // Construct the full path to the library file.
  const libraryPath = path.join(__dirname, libraryFile);
```

### Step 3: Check if the library file exists

Before we try to load the library, it's good practice to check if the file actually exists at the path we constructed. This allows us to provide a clearer error message if it's missing. We can use `fs.existsSync()` for this.

Add this code:

```javascript
  // Check if the library file actually exists at the constructed path.
  // If not, throw an error to prevent ffi-napi from failing silently.
  if (!fs.existsSync(libraryPath)) {
    throw new Error(`Core not found at ${libraryPath}`);
  }
```

### Step 4: Load the native library

This is the main part. We will use `ffi.Library()` to load our native library and define the functions we want to call from it.

`ffi.Library()` takes two arguments:
1.  The path to the library file.
2.  An object where keys are the function names you want to import, and values are an array defining the function's signature: `[returnType, [arg1Type, arg2Type, ...]]`.

For this tutorial, we only need to load one function: `retro_api_version`. This function takes no arguments and returns an integer. In `ffi-napi`, the type for an integer is `'int'`.

Add the following code to load the library:

```javascript
  // Load the native library from the specified path.
  // ffi.Library takes the library path and an object defining the functions to import.
   const lib = ffi.Library(libraryPath, {
    // 'retro_api_version' is the name of the function in the native library.
    // The value is an array where the first element is the return type ('int' for integer)
    // and the second element is an array of argument types (empty for no arguments).
    'retro_api_version': ['int', []]
  });
```

### Step 5: Return the loaded library

Finally, the `loadCoreNativeModule` function should return the `lib` object we just created, which represents the loaded library.

Change the last line of the function from `return null;` to:

```javascript
  return lib;
```

### Final Code

After following all the steps, your `loadCoreNativeModule` function in [`loadCoreNativeModule.start.js`](Tutorial%201%20-%20Calling%20Native%20Code%20from%20Nodejs/loadCoreNativeModule.start.js) should look like this, which matches [`loadCoreNativeModule.solution.js`](Tutorial%201%20-%20Calling%20Native%20Code%20from%20Nodejs/loadCoreNativeModule.solution.js):

```javascript
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
```

Now you can run the tests to see if your implementation is correct. From the root of the project, run:
```
npm test
```
If all tests pass, you are ready to try running it from the main.js in the current directory of this Readme:

```
node ./main.js
```


If you get the following response then everything went well:
```bash
API Version: 1
```

We have just successfully called one of the functions inside a libRetro Emulator core!
