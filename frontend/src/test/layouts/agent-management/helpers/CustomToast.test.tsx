/* eslint-disable testing-library/render-result-naming-convention */
import React from "react";
import { successtoast, errortoast, warningtoast, infotoast } from "../../../../../src/layouts/agent-management/helpers/CustomToast";
import { toast } from "react-toastify";
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
  Slide: jest.fn(),
}));

describe("CustomToast helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls toast.success with renderer", () => {
    successtoast("Success: done");
    expect(toast.success).toHaveBeenCalled();
    const renderer = (toast.success as jest.Mock).mock.calls[0][0];
    expect(typeof renderer).toBe("function");
  });

  it("calls toast.error with renderer", () => {
    errortoast("Error: failed");
    expect(toast.error).toHaveBeenCalled();
  });

  it("calls toast.warn with renderer", () => {
    warningtoast("Warning: careful");
    expect(toast.warn).toHaveBeenCalled();
  });

  it("calls toast.info with renderer", () => {
    infotoast("Info: hello");
    expect(toast.info).toHaveBeenCalled();
  });

  it("renderer renders without crashing (closeToast path)", () => {
    successtoast("Title: Subtitle");

    const renderer = (toast.success as jest.Mock).mock.calls[0][0];
    const element = renderer({ closeToast: jest.fn() });

    expect(React.isValidElement(element)).toBe(true);
  });

  it("renderer handles message without subtitle", () => {
    successtoast("OnlyTitle");

    const renderer = (toast.success as jest.Mock).mock.calls[0][0];
    const element = renderer({ closeToast: jest.fn() });

    expect(React.isValidElement(element)).toBe(true);
  });
});
