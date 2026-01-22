/* eslint-disable */
import "@testing-library/jest-dom";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { ResizeObserver } from "@juggle/resize-observer";
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}
global.ResizeObserver = ResizeObserver;
configure({ adapter: new Adapter() });
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

