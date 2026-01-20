/* eslint-disable */
import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SideBar from "../../../../../../src/layouts/agent-management/components/sidebar/SideBar";

const flushPromises = () => new Promise(setImmediate);

/* ---------------- REDUX ---------------- */
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: mockUseSelector,
}));

import { useSelector } from "react-redux";

/* ---------------- PERMISSIONS ---------------- */
const mockCanAccess = jest.fn(() => true);
jest.mock("../../../../../../src/utils/PermissionUtils", () => ({
  canAccess: mockCanAccess,
}));

/* ---------------- TOAST ---------------- */
jest.mock("../../../../../../src/layouts/agent-management/helpers/CustomToast", () => ({
  successtoast: jest.fn(),
  errortoast: jest.fn(),
}));

/* ---------------- SERVICE ---------------- */
jest.mock("../../../../../../src/services/agent/agentManagement.service", () => ({
  fetchAgentLogs: jest.fn(() =>
    Promise.resolve({ data: { data: [{ log: "x" }] } })
  ),
}));

/* ---------------- CHILD MOCKS ---------------- */

jest.mock("../../../../../../src/layouts/agent-management/components/sidebar/AgentTasks", () => (props: any) => (
  <div>
    <button data-testid="start" onClick={() => props.startJob("h", "p")} />
    <button data-testid="stop" onClick={() => props.stopJob("h", "p")} />
    <button data-testid="restart" onClick={() => props.restartJob("h", "p")} />
    <button data-testid="ssh" onClick={() => props.startAgentviaSSH("h", "p", "linux")} />
    <button data-testid="shutdown" onClick={() => props.shutDownAgent("h", "p")} />
    <button data-testid="restartAgent" onClick={() => props.restartAgent("h", "p")} />
    <button data-testid="health" onClick={() => props.checkAgentStatus("h", "p")} />
    <button data-testid="openScheduler" onClick={() => props.openScheduler("p")} />
    <button data-testid="upgrade" onClick={() => props.upgradeAgent("id", "type")} />
    <button data-testid="logs" onClick={() => props.loadAgentLogs("h", "id", "")} />
    <button data-testid="selectVersion" onClick={() => props.handleSelectAgentVersion("1.0")} />
    <button data-testid="upgradeConfirm" onClick={() => props.agentVersionUpgrade("p", [])} />
    <button data-testid="closeSub" onClick={props.closeSubModal} />
    <button data-testid="setJob" onClick={() => props.setJobName("job1")} />
    <button data-testid="openLog" onClick={() => props.setJobLogModal(true)} />
    <button data-testid="deleteJob" onClick={() => props.deleteSchedulerJob("h", "p", "job1")} />
  </div>
));

jest.mock("../../../../../../src/layouts/agent-management/components/sidebar/AgentDetails", () => () => <div data-testid="details" />);
jest.mock("../../../../../../src/layouts/agent-management/components/sidebar/AgentConfiguration", () => () => <div data-testid="config" />);

jest.mock("../../../../../../src/layouts/agent-management/components/sidebar/AgentLogs", () => (props: any) => (
  <div>
    <button data-testid="load" onClick={() => props.loadAgentLogs("h", "id", "")} />
    <button data-testid="refresh" onClick={() => props.refreshAgentLogs("h", "id", "")} />
    <button data-testid="copy" onClick={() => props.copyToClipboard({ a: 1 })} />
    <ul ref={props.logsBodyRef} data-testid="scrollTarget" />
  </div>
));

jest.mock("../../../../../../src/layouts/agent-management/components/DeleteModal", () => (props: any) =>
  props.open ? (
    <div>
      <button data-testid="confirmDelete" onClick={props.onDeleteButtonClick} />
      <button data-testid="closeDelete" onClick={props.onClose} />
    </div>
  ) : null
);

jest.mock("../../../../../../src/layouts/agent-management/components/JobLogsModal", () => (props: any) =>
  props.open ? (
    <div>
      <button data-testid="refreshJob" onClick={props.refreshAgentLogs} />
      <button data-testid="copyJob" onClick={() => props.copyToClipboard({})} />
      <ul ref={props.jobsLogRef} data-testid="jobScroll" />
    </div>
  ) : null
);

jest.mock("../../../../../../src/layouts/agent-management/components/LocalConfigModal", () => (props: any) =>
  props.open ? (
    <div>
      <input data-testid="localInput" onChange={(e) => props.handleInputChangeForSideBar("x", e)} />
      <button data-testid="saveLocal" onClick={() => props.saveConfigs("p", {})} />
      <button data-testid="closeLocal" onClick={props.onClose} />
    </div>
  ) : null
);

jest.mock("../../../../../../src/layouts/agent-management/components/SchedulerDialog", () => () => (
  <div data-testid="schedulerDialog" />
));

/* ---------------- SELECTOR MOCK ---------------- */
const defaultSelectorMock = (fn: any) => {
  switch (fn.name) {
    case "getAgentGlobalConfig": return { riseBot: [{ propertyName: "x", propertyValue: "y" }] };
    case "isJobReload": return true;
    case "isLocalConfigReload": return true;
    case "fetchScheduledJobsByCommandId": return { id: 1 };
    case "listScheduledJob": return [];
    case "getRepositories": return { data: { data: [] } };
    case "getAgentInfo": return { agent_config: {} };
    case "isServiceLoading": return false;
    case "isSchedulerLoading": return false;
    case "isAgentDetailsLoading": return false;
    default: return {};
  }
};

/* ---------------- TEST ---------------- */
describe("SideBar coverage", () => {
  const props = {
    open: true,
    setOpenSidebar: jest.fn(),
    openBar: false,
    configureModal: true,
    agentSelected: {
      hostname: "host",
      risebot: { agentId: "id" },
      risebotProperties: { a: "b" },
      agent_details: { os_version: "linux" },
    },
    port: "1234",
  };

  beforeEach(() => {
    mockUseSelector.mockImplementation(defaultSelectorMock);
    mockCanAccess.mockReturnValue(true);
    mockDispatch.mockClear();
  });

  it("covers everything deterministically", async () => {
    await act(async () => {
      render(<SideBar {...props} />);
    });

    fireEvent.click(screen.getByTestId("start"));
    fireEvent.click(screen.getByTestId("stop"));
    fireEvent.click(screen.getByTestId("restart"));
    fireEvent.click(screen.getByTestId("ssh"));
    fireEvent.click(screen.getByTestId("shutdown"));
    fireEvent.click(screen.getByTestId("restartAgent"));
    fireEvent.click(screen.getByTestId("health"));
    fireEvent.click(screen.getByTestId("openScheduler"));
    fireEvent.click(screen.getByTestId("upgrade"));
    fireEvent.click(screen.getByTestId("logs"));
    fireEvent.click(screen.getByTestId("selectVersion"));
    fireEvent.click(screen.getByTestId("upgradeConfirm"));
    fireEvent.click(screen.getByTestId("closeSub"));
    fireEvent.click(screen.getByTestId("setJob"));
    fireEvent.click(screen.getByTestId("openLog"));

    fireEvent.change(screen.getByTestId("localInput"), { target: { value: "123" } });
    fireEvent.click(screen.getByTestId("saveLocal"));
    fireEvent.click(screen.getByTestId("closeLocal"));

    fireEvent.click(screen.getByTestId("deleteJob"));
fireEvent.click(screen.getByTestId("confirmDelete"));

const closeBtn = screen.queryByTestId("closeDelete");
if (closeBtn) fireEvent.click(closeBtn);

fireEvent.click(screen.getByTestId("refreshJob"));
fireEvent.click(screen.getByTestId("copyJob"));

fireEvent.scroll(screen.getByTestId("scrollTarget"), {
  target: { scrollTop: 100, clientHeight: 100, scrollHeight: 150 },
});

fireEvent.scroll(screen.getByTestId("jobScroll"), {
  target: { scrollTop: 100, clientHeight: 100, scrollHeight: 150 },
});

await act(async () => {
  await flushPromises();
});

expect(screen.getByTestId("sidebarId")).toBeInTheDocument();

  });

  it("does not call loadAgentInfo when open is false", async () => {
    const propsOpenFalse = { ...props, open: false };
    await act(async () => {
      render(<SideBar {...propsOpenFalse} />);
    });
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: expect.stringContaining("fetchAgentInfo") })
    );
  });

  it("does not render accordions when permissions are false", async () => {
    mockCanAccess.mockReturnValue(false);
    await act(async () => {
      render(<SideBar {...props} />);
    });
    expect(screen.queryByTestId("details")).not.toBeInTheDocument();
    expect(screen.queryByTestId("config")).not.toBeInTheDocument();
    expect(screen.queryByTestId("scrollTarget")).not.toBeInTheDocument();
  });

  it("handles empty globalConfigs", async () => {
    mockUseSelector.mockImplementation((fn) => {
      if (fn.name === "getAgentGlobalConfig") return {};
      return defaultSelectorMock(fn);
    });
    await act(async () => {
      render(<SideBar {...props} />);
    });
    expect(screen.getByTestId("sidebarId")).toBeInTheDocument();
  });

  it("handles empty agentSelected", async () => {
    const propsEmptyAgent = { ...props, agentSelected: {} };
    await act(async () => {
      render(<SideBar {...propsEmptyAgent} />);
    });
    expect(screen.getByTestId("sidebarId")).toBeInTheDocument();
  });

  it("handles empty fetchScheduler", async () => {
    mockUseSelector.mockImplementation((fn) => {
      if (fn.name === "fetchScheduledJobsByCommandId") return {};
      return defaultSelectorMock(fn);
    });
    await act(async () => {
      render(<SideBar {...props} />);
    });
    expect(screen.getByTestId("sidebarId")).toBeInTheDocument();
  });

  it("handles jobReload false", async () => {
    mockUseSelector.mockImplementation((fn) => {
      if (fn.name === "isJobReload") return false;
      return defaultSelectorMock(fn);
    });
    await act(async () => {
      render(<SideBar {...props} />);
    });
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: expect.stringContaining("listSchedulerCommand") })
    );
  });

  it("handles error in deleteScheduler", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockDispatch.mockImplementationOnce(() => {
      throw new Error("Delete error");
    });
    await act(async () => {
      render(<SideBar {...props} />);
    });
    fireEvent.click(screen.getByTestId("deleteJob"));
    fireEvent.click(screen.getByTestId("confirmDelete"));
    expect(consoleSpy).toHaveBeenCalledWith("Error while deleting", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("handles copyToClipboard error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: jest.fn().mockRejectedValue(new Error("Clipboard error")) },
      writable: true,
    });
    await act(async () => {
      render(<SideBar {...props} />);
    });
    fireEvent.click(screen.getByTestId("copy"));
    expect(consoleSpy).toHaveBeenCalledWith("Failed to copy:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("handles empty selectedAgentVersion in upgrade", async () => {
    await act(async () => {
      render(<SideBar {...props} />);
    });
    fireEvent.click(screen.getByTestId("upgradeConfirm"));
    expect(require("../../../../../../src/layouts/agent-management/helpers/CustomToast").errortoast).toHaveBeenCalledWith("Please select the RISEBOT version");
  });

  it("handles handleClose via close button", async () => {
    await act(async () => {
      render(<SideBar {...props} />);
    });
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
    expect(props.setOpenSidebar).toHaveBeenCalledWith(false);
  });
});
