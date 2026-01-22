import { createStore as reduxCreateStore, applyMiddleware as reduxApplyMiddleware, compose as reduxCompose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import initializeStore from "../../redux/initializeStore";
import rootReducer from "../../redux/reducers";
import sagas from "../../redux/sagas";
jest.mock("redux", () => {
  const actualRedux = jest.requireActual("redux");
  return {
    ...actualRedux,
    createStore: jest.fn(),
    applyMiddleware: jest.fn(() => "mockMiddleware"),
    compose: jest.fn((...args) => args[0]), // Return the first enhancer
  };
});

const runMock = jest.fn();
const sagaMiddlewareMock = { run: runMock };

jest.mock("redux-saga", () => ({
  __esModule: true,
  default: jest.fn(() => sagaMiddlewareMock),
}));

jest.mock("redux-logger", () => ({
  createLogger: jest.fn(() => "mockLogger"),
}));

jest.mock("../../redux/reducers", () => jest.fn());
jest.mock("../../redux/sagas", () => jest.fn());
jest.mock("../../redux/initialState.ts", () => ({
  __esModule: true,
  default: {
    app: { testKey: "testValue" },
  },
}));

describe("initializeStore", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should create store with saga and logger middleware in development", () => {
    process.env.NODE_ENV = "development";
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = jest.fn((f) => f);

    initializeStore();

    expect(createLogger).toHaveBeenCalled();
    expect(runMock).toHaveBeenCalledWith(sagas);
    expect(reduxCreateStore).toHaveBeenCalledWith(
      expect.anything(),
      { app: { testKey: "testValue" } },
      expect.anything()
    );
  });

  it("should create store without logger middleware in production", () => {
    process.env.NODE_ENV = "production";
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    initializeStore();

    expect(createLogger).not.toHaveBeenCalled();
    expect(runMock).toHaveBeenCalledWith(sagas);
    expect(reduxCreateStore).toHaveBeenCalledWith(
      expect.anything(),
      { app: { testKey: "testValue" } },
      expect.anything()
    );
  });

  it("should use default compose if Redux DevTools is not available", () => {
    process.env.NODE_ENV = "development";
    delete (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    initializeStore();

    expect(runMock).toHaveBeenCalledWith(sagas);
    expect(reduxCreateStore).toHaveBeenCalledWith(
      expect.anything(),
      { app: { testKey: "testValue" } },
      expect.anything()
    );
  });
});




