// This is the starting point for the tutorial.
// You will add code to this file to make the tests in screen.test.js pass.
// Or you can just read the screen.solution.js file

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
  // Tutorial Task: Get the current width and height of the window and store them in the screen object.
  // Tutorial Task: Calculate the stride (bytes per row). Each pixel is 4 bytes (RGBA).
  // Tutorial Task: Allocate a new buffer with the correct size.
}

/**
 * This function draws a color gradient to the screen buffer.
 * The color changes from top-to-bottom and left-to-right.
 */
export function drawBackground() {
  // Tutorial Task: Implement the logic to draw a background.
  // A good starting point is to loop through each pixel and set a color.
  // You can use the screen.width and screen.height properties to know the dimensions.
}

/**
 * This function draws the player's rectangle onto the screen buffer.
 */
export function drawPlayer() {
  // Tutorial Task: Implement the logic to draw the player.
  // You should use the player's x, y, width, and height to determine where to draw.
  // Remember to check if the pixel is within the screen boundaries.
}

/**
 * This function orchestrates the drawing of a single frame.
 * It clears the screen by drawing the background, then draws the player.
 */
export function redraw() {
  // Tutorial Task: Call the functions to draw the background and the player.
  // Tutorial Task: Render the final buffer to the window.
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