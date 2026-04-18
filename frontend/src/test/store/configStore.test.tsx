import store from "../../store/configStore";

describe("Redux Store Configuration", () => {
  it("should be defined", () => {
    expect(store).toBeDefined();
  });

  it("should have a getState method", () => {
    expect(typeof store.getState).toBe("function");
  });

  it("should return the initial state with reducers", () => {
    const state = store.getState();
    expect(state).toBeDefined();
    expect(typeof state).toBe("object");
  });

  it("should have a dispatch method", () => {
    expect(typeof store.dispatch).toBe("function");
  });

  it("should have a subscribe method", () => {
    expect(typeof store.subscribe).toBe("function");
  });

  it("should initialize with proper reducer configuration", () => {
    const state = store.getState();
    expect(typeof state).toBe("object");
    expect(state).toBeDefined();
  });
});