import {
  convertDate,
  convertDateTime,
  prepareAgentDetails,
  prepareAgentConfigDetails,
} from "../../../../../src/layouts/agent-management/helpers/agentHelpers";

describe("agentHelpers", () => {
  describe("convertDate", () => {
    it("formats valid unix timestamp", () => {
      const unix = Math.floor(Date.now() / 1000);
      const result = convertDate(unix, "INVALID");
      expect(result).not.toBe("INVALID");
    });

    it("returns falseValue for invalid date", () => {
      const result = convertDate("abc" as any, "INVALID");
      expect(result).toBe("INVALID");
    });
  });

  describe("convertDateTime", () => {
    it("returns formatted date only", () => {
      const result = convertDateTime(new Date(), "INVALID", true);
      expect(result).toMatch(/\d{2}-[A-Za-z]+-\d{4}/);
    });

    it("returns formatted date and time", () => {
      const result = convertDateTime(new Date(), "INVALID", false);
      expect(result).toContain("-");
      expect(result).toContain(":");
    });

    it("returns falseValue when invalid date provided", () => {
      const result = convertDateTime("invalid-date", "INVALID", false);
      expect(result).toBe("INVALID");
    });
  });

  describe("prepareAgentDetails", () => {
    it("returns full details when data exists", () => {
      const data = {
        agent_details: {
          agent_type: "TYPE",
          version: "1.0",
          vm_hostname: "host",
          vm_ip: "1.1.1.1",
          install_dir: "/opt",
          rust_version: "1.72",
          os_version: "linux",
          server_port: 8080,
          pid: 123,
          agent_last_start_time: Math.floor(Date.now() / 1000),
          up_time: "10h",
          memory: "20%",
          cpu_usage: "30%",
          disk_usage: "40%",
        },
        cmdb: {
          ciOsType: "Linux",
          slRegion: "IN",
          slName: "Service",
          slPlatform: "AWS",
          ciSapNameEnv: "DEV",
          ciSapNameSid: "SID",
        },
      };

      const result = prepareAgentDetails(data);
      expect(result.length).toBeGreaterThan(10);
      expect(result.find(x => x.label === "VM Host Name")?.value).toBe("HOST");
    });

    it("falls back to defaults when data missing", () => {
      const result = prepareAgentDetails({});
      expect(result.length).toBeGreaterThan(0);
      expect(result.find(x => x.label === "Version")?.value).toBe("NOT_FOUND");
    });
  });

  describe("prepareAgentConfigDetails", () => {
    it("returns config when present", () => {
      const result = prepareAgentConfigDetails({
        agent_local_config: {
          server_port: 9000,
          auto_upgrade: true,
        },
      });

      expect(result[0].propertyValue).toBe("9000");
      expect(result[1].propertyValue).toBe("true");
    });

    it("returns defaults when missing", () => {
      const result = prepareAgentConfigDetails({});
      expect(result[0].propertyValue).toBe("0");
      expect(result[1].propertyValue).toBe("false");
    });
  });
});
