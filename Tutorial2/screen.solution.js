// Import the 'sdl' library, which provides low-level access to audio, keyboard, mouse, joystick, and graphics hardware.
import { video } from '@kmamal/sdl';

// --- Setup ---
// Create a new window with a title and make it resizable. This window will be our screen.
const window = video.createWindow({ title: "NodeRetro", resizable: true });

// The 'player' object holds the state of the character we can control.
export const player = {
  x: 0, // The horizontal position (x-coordinate) of the player.
  y: 0, // The vertical position (y-coordinate) of the player.
  width: 10, // The width of the player's rectangle.
  height: 10, // The height of the player's rectangle.
  speed: 5, // The number of pixels the player moves per key press.
  color: { r: 255, g: 255, b: 255, a: 255 }, // The player's color (white).
};

// The 'screen' object holds the state of our display buffer.
export const screen = {
  width: 0, // The width of the screen in pixels.
  height: 0, // The height of the screen in pixels.
  stride: 0, // The number of bytes per row of pixels.
  buffer: null, // The buffer that holds all the pixel data for the screen.
};

/**
 * This function updates the screen's dimensions and re-allocates the buffer.
 * It should be called whenever the window is resized.
 */
export function updateScreenDimensions() {
  // Get the current width and height of the window.
  const { pixelWidth, pixelHeight } = window;
  screen.width = pixelWidth;
  screen.height = pixelHeight;
  // Calculate the stride (bytes per row). Each pixel is 4 bytes (RGBA).
  screen.stride = screen.width * 4;
  // Allocate a new buffer with the correct size.
  screen.buffer = Buffer.alloc(screen.stride * screen.height);
}

/**
 * This function draws a color gradient to the screen buffer.
 * The color changes from top-to-bottom and left-to-right.
 */
export function drawBackground() {
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

/**
 * This function draws the player's rectangle onto the screen buffer.
 */
export function drawPlayer() {
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

/**
 * This function orchestrates the drawing of a single frame.
 * It clears the screen by drawing the background, then draws the player.
 */
export function redraw() {
  drawBackground();
  drawPlayer();
  // Render the final buffer to the window.
  window.render(screen.width, screen.height, screen.stride, 'rgba32', screen.buffer);
}

/**
 * This function is the event handler for when the window is resized.
 */
function handleResize() {
  // First, update the screen dimensions and create a new buffer.
  updateScreenDimensions();
  // Then, redraw the screen with the new dimensions.
  redraw();
}

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

// --- Initial Draw ---
// Call handleResize once at the start to set initial dimensions and draw the screen.
handleResize();