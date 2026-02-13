import history from "../../config/history";

test("createBrowserHistory creates history object", () => {
  expect(history).toBeInstanceOf(Object);
});