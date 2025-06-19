import { jest, describe, test, beforeAll, beforeEach } from '@jest/globals';

// Mock the window object and its methods to avoid actual rendering during tests.
// Using unstable_mockModule for better compatibility with ES Modules
await jest.unstable_mockModule('@kmamal/sdl', () => {
  const mockWindow = {
    on: jest.fn().mockReturnThis(),
    render: jest.fn(),
    pixelWidth: 100,
    pixelHeight: 100,
  };
  return {
    video: {
      createWindow: jest.fn(() => mockWindow),
    },
  };
});

describe('Screen and Player', () => {
  let screen, player, updateScreenDimensions, drawBackground, drawPlayer;

  beforeAll(async () => {
    const modulePath = process.env.SOLUTION
      ? './screen.solution.js'
      : './screen.start.js';
    
    const module = await import(modulePath);
    screen = module.screen;
    player = module.player;
    updateScreenDimensions = module.updateScreenDimensions;
    drawBackground = module.drawBackground;
    drawPlayer = module.drawPlayer;
  });

  beforeEach(() => {
    // Reset player and screen state before each test
    if (player) {
      player.x = 0;
      player.y = 0;
    }
    if (screen) {
      screen.width = 0;
      screen.height = 0;
      screen.stride = 0;
      screen.buffer = null;
    }
  });

  test('updateScreenDimensions should set screen properties correctly', () => {
    updateScreenDimensions();
    expect(screen.width).toBe(100);
    expect(screen.height).toBe(100);
    expect(screen.stride).toBe(400);
    expect(screen.buffer).toBeInstanceOf(Buffer);
    expect(screen.buffer.length).toBe(40000);
  });

  test('drawBackground should fill the buffer', () => {
    updateScreenDimensions();
    drawBackground();
    // A simple check to see if the buffer is not all zeros.
    // A more sophisticated test could check for the gradient pattern.
    let nonZero = false;
    for (let i = 0; i < screen.buffer.length; i++) {
      if (screen.buffer[i] !== 0) {
        nonZero = true;
        break;
      }
    }
    // The blue channel is always 0, but R, G, and A should be non-zero at some point.
    // This test is not perfect but good enough for the tutorial.
    expect(nonZero).toBe(true);
  });

  test('drawPlayer should draw the player on the buffer', () => {
    updateScreenDimensions();
    drawBackground(); // Start with a clean background
    player.x = 10;
    player.y = 10;
    drawPlayer();

    // Check a pixel where the player should be
    const offset = (player.y * screen.stride) + (player.x * 4);
    expect(screen.buffer[offset]).toBe(player.color.r);
    expect(screen.buffer[offset + 1]).toBe(player.color.g);
    expect(screen.buffer[offset + 2]).toBe(player.color.b);
    expect(screen.buffer[offset + 3]).toBe(player.color.a);
  });
});