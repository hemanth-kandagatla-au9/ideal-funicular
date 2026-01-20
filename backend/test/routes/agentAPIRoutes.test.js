/**
 * Module dependencies.
 */
require("regenerator-runtime");

const agentAPIRoutes = require("../../server/routes/agentRoutes");

/**
 * Testing agent route.
 */
test("test agentAPIRoutes", () => {
  expect(agentAPIRoutes).not.toBeUndefined();
  expect(agentAPIRoutes).not.toBeNull();
  expect(agentAPIRoutes).not.toBe(null);
});
