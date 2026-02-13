import DownloadToExcel from "../../../../../src/layouts/agent-management/helpers/DownloadToExcel";
import ExcelUtils from "@/utils/ExportDataToExcel";
import Utils from "@/utils/utils";
import { successtoast, errortoast } from "../../../../../src/layouts/agent-management/helpers/CustomToast";
import { convertDate } from "../../../../../src/layouts/agent-management/helpers/agentHelpers";
jest.mock("@/utils/ExportDataToExcel", () => ({
  exportDataToExcel: jest.fn(),
}));

jest.mock("@/utils/utils", () => ({
  toPercentage: jest.fn((v: any) => `percent-${v}`),
  bytesToMB: jest.fn((v: any) => `mb-${v}`),
}));

jest.mock("../../../../../src/layouts/agent-management/helpers/CustomToast", () => ({
  successtoast: jest.fn(),
  errortoast: jest.fn(),
}));

jest.mock("../../../../../src/layouts/agent-management/helpers/agentHelpers", () => ({
  convertDate: jest.fn(() => "formatted-date"),
}));

describe("DownloadToExcel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("downloads and exports successfully", async () => {
    const getTotalRowsCount = jest.fn().mockReturnValue(2);

    const fetchDataForDownload = jest.fn().mockResolvedValue([
      {
        hostname: "host1",
        cmdb: { slRegion: "IN", slName: "SL1" },
        agent_details: {
          vm_ip: "1.1.1.1",
          server_port: 8080,
          pid: 123,
          version: "1.0",
          up_time: "10h",
          cpu_usage: 50,
          disk_usage: 1000,
          memory: 2000,
          install_dir: "/opt",
          os_version: "linux",
          rust_version: "1.72",
        },
        jobs: ["job1", "job2"],
      },
    ]);

    await DownloadToExcel(getTotalRowsCount, fetchDataForDownload);
    expect(fetchDataForDownload).toHaveBeenCalledWith(2);
    expect(successtoast).toHaveBeenCalledWith("download started successfully.");
    expect(Utils.toPercentage).toHaveBeenCalled();
    expect(Utils.bytesToMB).toHaveBeenCalled();
    expect(convertDate).toHaveBeenCalled();
    expect(ExcelUtils.exportDataToExcel).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          Hostname: "host1",
          IP: "1.1.1.1",
          Jobs: "job1, job2",
        }),
      ]),
      "RISEBOT"
    );
  });

  it("shows error toast when something fails", async () => {
    const getTotalRowsCount = jest.fn().mockImplementation(() => {
      throw new Error("fail");
    });

    const fetchDataForDownload = jest.fn();

    await DownloadToExcel(getTotalRowsCount, fetchDataForDownload);

    expect(errortoast).toHaveBeenCalledWith(
      "failed to download. please try again."
    );
  });
});
