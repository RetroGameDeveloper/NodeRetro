# NodeRetro
A small lightweight LibRetro Frontend Written in NodeJS and SDL (learning project)

---

# Creating your own LibRetro Frontend in Nodejs Tutorial
This tutorial presumes you already have some Javascript knowledge and will teach the basics of using SDL with Nodejs.
Additionally, this document serves as a tutorial that will guide you through the process of creating your own libretro frontend. 

To maximize learning we will be building it from scratch rather than using an existing libretro binding such as **node-retro**.

## Initial Setup

### Step 1 - Obtaining Libretro cores for your target Operating System
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

### Step 2 - Install dependencies and run tests
```javascript
npm install
npm run test # Runs all the tests for the *.solution.js files
```

---
## How to use this project
This project is split into multiple tutorials, each inside their own folder and each expanding from the previous.

In each tutorial you can either try to implement it yourself by getting the *.test.js unit tests to pass in a Test driven development style. 
Or you can simple read the *.solution.js file.

By following the tutorials below, you can learn how it works and get started right away:

- [Tutorial 1 - Calling Native Code from Nodejs](./Tutorial1/README.md)
- [Tutorial 2 - Initial SDL Screen with Input](./Tutorial2/README.md)


Each tutorial folder has the files that make up the project at that state in time. Tutorial 2 is an enhancement of Tutorial 1 for example. So you can easily see the differences by comparing files side by side.