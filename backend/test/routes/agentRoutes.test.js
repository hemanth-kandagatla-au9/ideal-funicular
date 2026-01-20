/**
 * Module dependencies.
 */
require("regenerator-runtime");

const agentRoutes = require("../../server/routes/agentRoutes");

/**
 * Testing agent route.
 */
test("test grcRoutes", () => {
  expect(agentRoutes).not.toBeUndefined();
  expect(agentRoutes).not.toBeNull();
  expect(agentRoutes).not.toBe(null);
});
