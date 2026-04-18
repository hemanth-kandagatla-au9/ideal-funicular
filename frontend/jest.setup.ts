// Jest setup file - runs before all tests
import "@testing-library/jest-dom";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Redux DevTools Extension
Object.defineProperty(window, "__REDUX_DEVTOOLS_EXTENSION__", {
  writable: true,
  value: undefined,
});

Object.defineProperty(window, "__REDUX_DEVTOOLS_EXTENSION_COMPOSE__", {
  writable: true,
  value: undefined,
});

Object.defineProperty(window, "__HOST_APP__", {
  writable: true,
  value: false,
});

Object.defineProperty(window, "__REDUX_STORE__", {
  writable: true,
  value: undefined,
});

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && (args[0].includes("Not implemented: HTMLFormElement.prototype.submit") || args[0].includes("window.__HOST_GET_TOKEN__"))) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
