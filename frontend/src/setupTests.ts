/* eslint-disable */
import "@testing-library/jest-dom";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { ResizeObserver } from "@juggle/resize-observer";

// Extend the global interface to include ResizeObserver
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

// Assign ResizeObserver to global scope
global.ResizeObserver = ResizeObserver;

// Configure Enzyme adapter
configure({ adapter: new Adapter() });

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
