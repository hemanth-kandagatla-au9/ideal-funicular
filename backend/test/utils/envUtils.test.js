const {
  getRustPassword,
  getOpenSearchPassword,
  getMasterAgentPassword,
  getServiceAccountPassword,
  getMongoConnectionURL,
  getMongoPem,
  getMSALClientID,
  getMSALTenantID
} = require("../../server/utils/envUtils");

jest.mock("../../server/utils/ssm.js", () => {
  return {
    getParam: jest.fn().mockResolvedValue({
      Parameter: {
        Value: "mockVal",
      },
    }),
  };
});

describe("envUtils", () => {
  it("getRustPassword should return a value", async () => {
    const res = await getRustPassword();
    expect(res).not.toBe(null);
  });


  it("getOpenSearchPassword should return a value", async () => {
    const res = await getOpenSearchPassword();
    expect(res).not.toBe(null);
  });

  it.skip("getMasterAgentPassword should return a value", async () => {
    const res = await getMasterAgentPassword();
    expect(res).not.toBe(null);
  });



  it("getServiceAccountPassword should return a value", async () => {
    const res = await getServiceAccountPassword();
    expect(res).not.toBe(null);
  });


  it("getMongoConnectionURL should return a value", async () => {
    const res = await getMongoConnectionURL();
    expect(res).not.toBe(null);
  });

  it("getMongoPem should return a value", async () => {
    const res = await getMongoPem();
    expect(res).not.toBe(null);
  });

  it("getMSALClientID should return a value", async () => {
    const res = await getMSALClientID();
    expect(res).not.toBe(null);
  });

  it("getMSALTenantID should return a value", async () => {
    const res = await getMSALTenantID();
    expect(res).not.toBe(null);
  });
});
