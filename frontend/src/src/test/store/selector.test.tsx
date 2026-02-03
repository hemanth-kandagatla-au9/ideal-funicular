/* eslint-disable import/first */
jest.mock("../../store/selector", () => ({
  __esModule: true,
  dataSelector: jest.fn(state => state),
  default: jest.fn(state => state),
}));

import { dataSelector } from "../../store/selector";

describe("dataSelector", () => {
  it("should return the full state object", () => {
    const mockState = {
      user: { name: "Alice", role: "admin" },
      settings: { darkMode: true },
    };

    dataSelector.mockImplementation(state => state);

    const result = dataSelector(mockState);
    expect(result).toEqual(mockState);
  });

  it("should return empty object if state is empty", () => {
    const mockState = {};

    dataSelector.mockImplementation(state => state);

    const result = dataSelector(mockState);
    expect(result).toEqual({});
  });
});
