import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { ResizeObserver } from "@juggle/resize-observer";

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
