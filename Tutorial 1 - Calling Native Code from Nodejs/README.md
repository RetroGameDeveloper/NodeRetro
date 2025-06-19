# NodeRetro - Tutorial 1 - Calling Native Code From Nodejs

This tutorial presumes you already have some Javascript knowledge and will teach the basics of using SDL with Nodejs.

Additionally, this document serves as a tutorial that will guide you through the process of creating your own libretro frontend. As this is a tutorial we will be building it from scratch rather than using an existing libretro binding such as **node-retro** which hasn't been updated in 10 years.

By following the steps below, you can learn how it works and get started right away.

## Step 1 - Obtaining Libretro cores for your target Operating System
In order to have a frontend we need emulation cores to run, there are a few ways to get these:
* Compile them yourself using the source code
* Obtain the pre-compiled versions from RetroArch
* Obtain pre-compiled versions from the Nightly Builds - https://buildbot.libretro.com/nightly/

To start this project we will be using the Game Boy Core called `gambatte`, the easiest way to get this core is to use the Nightly builds link for your chosen Operating System:
* MacOSX - https://buildbot.libretro.com/nightly/apple/osx/x86_64/latest/gambatte_libretro.dylib.zip
* Linux - https://buildbot.libretro.com/nightly/linux/x86/latest/gambatte_libretro.so.zip
* Windows - https://buildbot.libretro.com/nightly/windows/x86_64/latest/gambatte_libretro.dll.zip

Note that the links above are presuming x86, if you are on arm you will need to go to https://buildbot.libretro.com/nightly/ and follow the directory tree until you find an ARM version.

We will need the other cores in the future so feel free to download the zip of all the cores you are interested in while you are here.

Create a new folder called "cores" and unzip all your chosen cores into it.

---
## Step 2 - Calling Native Code from Nodejs
All the libRetro cores are compiled as native libraries (.dll on Windows, .dylib on MacosX, .so on Linux), we need to be able to call the fucntions in these cores in order to have a functioning libRetro Frontend.

First we need to install the Node package that allows you to interface with dynamic libraries using Foreign Function Interface (FFI) Native API:
```
npm install ffi-napi ref-napi
```

Now that we have that installed we need to use it to call a function inside our downloaded Gambatte core.

So lets start with really basic code to do just that:
```js
// main.js
const ffi = require('ffi-napi'); // This is the Node.js module (ffi stands for Foreign Function Interface) that allows interfacing with dynamic libraries
const path = require('path'); // This is a core Node.js module used for handling and transforming file paths.

// Determine the correct library path based on the platform
const libraryFile = {
    'win32': 'cores/gambatte_libretro.dll',
    'darwin': 'cores/gambatte_libretro.dylib',
    'linux': 'cores/gambatte_libretro.so'
}[process.platform]; // process.platform returns the platform identifier for which Node.js is running (e.g., win32 for Windows, darwin for macOS, linux for Linux).

if (!libraryFile) {
  // If libraryFile is not defined (which shouldn't happen if process.platform matches one of the keys in libraryFile), an error is thrown indicating that the platform is not supported.
    throw new Error(`Unsupported platform: ${process.platform}`);
}

const libraryPath = path.join(__dirname, libraryFile); // __dirname is the directory name of the current script, path.join is used to concatenate __dirname with libraryFile, forming the complete path to the native library file.

// Load the library
const lib = ffi.Library(libraryPath, { // ffi.Library is a function provided by ffi-napi to load a dynamic library.
  'retro_api_version': ['int', []] // Here, retro_api_version is a function that returns an integer and takes no arguments.
});

const result = lib.retro_api_version(); // lib.retro_api_version() calls the retro_api_version function from the loaded library (dll/dylib/so).
console.log("API Version:",result)
```

If you get the following response then everything went well:
```bash
API Version: 1
```

We have just successfully called one of the functions inside a libRetro Emulator core!
