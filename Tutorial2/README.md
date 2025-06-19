# Tutorial 2 - Graphics and Input
Ok now that we know we can successfully call the emulator call lets make a small detour and create a simple window that allows the user to move a pixel around the screen with their arrow keys.

We will use SDL for this for a couple of reasons:
* Cross-Platform support - has versions for all common Operating Systems (and even many games consoles such as PSP, Wii etc which is cool but not relevant to this project, although the skills you learn here can be applied to any port of SDL2)
* Keyboard, Gamepad & Audio support - we don't need seperate libraries for different input methods or Audio functionality, its all handled in one library
* Has support for DirectX and OpenGL - required if we ever get to 3D cores such as Nintendo64 or Playstation 1.

First step is to install the SDL Nodejs bindings like so:
```bash
npm install @kmamal/sdl
```

Now, let's create a file named `screen.js` and add the following code.

### 1. Setup and Window Creation
First, we import the `sdl` library and create a window.

```javascript
// Import the 'sdl' library, which provides low-level access to audio, keyboard, mouse, joystick, and graphics hardware.
import sdl from '@kmamal/sdl'

// --- Setup ---
// Create a new window with a title and make it resizable. This window will be our screen.
const window = sdl.video.createWindow({ title: "NodeRetro", resizable: true });
```

### 2. Player and Screen State
We'll define two objects to hold the state of our player and the screen. The `player` object stores its position, size, and speed. The `screen` object will hold information about our drawing buffer.

```javascript
// The 'player' object holds the state of the character we can control.
const player = {
  x: 0, // The horizontal position (x-coordinate) of the player.
  y: 0, // The vertical position (y-coordinate) of the player.
  width: 10, // The width of the player's rectangle.
  height: 10, // The height of the player's rectangle.
  speed: 5, // The number of pixels the player moves per key press.
  color: { r: 255, g: 255, b: 255, a: 255 }, // The player's color (white).
};

// The 'screen' object holds the state of our display buffer.
const screen = {
  width: 0, // The width of the screen in pixels.
  height: 0, // The height of the screen in pixels.
  stride: 0, // The number of bytes per row of pixels.
  buffer: null, // The buffer that holds all the pixel data for the screen.
};
```

### 3. Drawing Functions
We need functions to draw our scene. We'll start with a function to handle screen resizing, which will also allocate the buffer for our pixel data.

```javascript
/**
 * This function updates the screen's dimensions and re-allocates the buffer.
 * It should be called whenever the window is resized.
 */
function updateScreenDimensions() {
  // Get the current width and height of the window.
  const { pixelWidth, pixelHeight } = window;
  screen.width = pixelWidth;
  screen.height = pixelHeight;
  // Calculate the stride (bytes per row). Each pixel is 4 bytes (RGBA).
  screen.stride = screen.width * 4;
  // Allocate a new buffer with the correct size.
  screen.buffer = Buffer.alloc(screen.stride * screen.height);
}
```

Next, a function to draw a colorful background gradient. This helps visualize that our screen is being updated correctly.

```javascript
/**
 * This function draws a color gradient to the screen buffer.
 * The color changes from top-to-bottom and left-to-right.
 */
function drawBackground() {
  let offset = 0;
  // Loop through each row (y-coordinate).
  for (let i = 0; i < screen.height; i++) {
    // Loop through each column (x-coordinate).
    for (let j = 0; j < screen.width; j++) {
      // Set the Red component based on the row.
      screen.buffer[offset++] = Math.floor(255 * i / screen.height);
      // Set the Green component based on the column.
      screen.buffer[offset++] = Math.floor(255 * j / screen.width);
      // Set the Blue component to 0.
      screen.buffer[offset++] = 0;
      // Set the Alpha component to 255 (fully opaque).
      screen.buffer[offset++] = 255;
    }
  }
}
```

Now, a function to draw our player (a white square) onto the screen buffer.

```javascript
/**
 * This function draws the player's rectangle onto the screen buffer.
 */
function drawPlayer() {
  // Loop through each pixel of the player's rectangle.
  for (let i = 0; i < player.height; i++) {
    for (let j = 0; j < player.width; j++) {
      // Calculate the absolute x and y coordinates on the screen.
      const y = player.y + i;
      const x = player.x + j;

      // Check if the pixel is within the screen boundaries.
      if (y >= 0 && y < screen.height && x >= 0 && x < screen.width) {
        // Calculate the position in the buffer for this pixel.
        const offset = (y * screen.stride) + (x * 4);
        // Set the color of the pixel to the player's color.
        screen.buffer[offset] = player.color.r;
        screen.buffer[offset + 1] = player.color.g;
        screen.buffer[offset + 2] = player.color.b;
        screen.buffer[offset + 3] = player.color.a;
      }
    }
  }
}
```

Finally, a `redraw` function to orchestrate the drawing process and render the buffer to the window.

```javascript
/**
 * This function orchestrates the drawing of a single frame.
 * It clears the screen by drawing the background, then draws the player.
 */
function redraw() {
  drawBackground();
  drawPlayer();
  // Render the final buffer to the window.
  window.render(screen.width, screen.height, screen.stride, 'rgba32', screen.buffer);
}
```

### 4. Event Handling
We need to handle events like window resizing and key presses.

This function will handle the resize event. It updates the screen dimensions and redraws the scene.

```javascript
/**
 * This function is the event handler for when the window is resized.
 */
function handleResize() {
  // First, update the screen dimensions and create a new buffer.
  updateScreenDimensions();
  // Then, redraw the screen with the new dimensions.
  redraw();
}
```

Now we set up the event listeners on the window object. We listen for `resize`, `expose` (when the window becomes visible), and `keyDown`.

```javascript
// --- Event Handling ---
// Set up event listeners for the window.
window
  // When the window is resized, call handleResize.
  .on('resize', handleResize)
  // When the window is exposed (e.g., uncovered), call redraw.
  .on('expose', redraw)
  // Listen for when a key is pressed down.
  .on('keyDown', (event) => {
    // Use a switch statement to handle different keys.
    switch (event.key) {
      case "left":
        player.x -= player.speed;
        break;
      case "right":
        player.x += player.speed;
        break;
      case "up":
        player.y -= player.speed;
        break;
      case "down":
        player.y += player.speed;
        break;
    }
    // After moving the player, redraw the screen to show the change.
    redraw();
  });
```
When an arrow key is pressed, we update the player's coordinates and call `redraw()` to update the screen.

### 5. Initial Draw
To get everything on screen when the application starts, we call `handleResize()` once. This sets the initial dimensions, creates the buffer, and draws the first frame.

```javascript
// --- Initial Draw ---
// Call handleResize once at the start to set initial dimensions and draw the screen.
handleResize();
```

### Running the code
To run this, save the code above as `screen.js` and execute it with Node.js:

```bash
node "Tutorial2/screen.js"
```

You should see a window with a colorful gradient and a white square. You can move the square around using the arrow keys.
The window is also resizable.
