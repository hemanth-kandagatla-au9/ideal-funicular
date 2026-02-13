import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Dialog, Button } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import MultiselectObjectDropdown from "../../../components/ui/multiselectdropdown/MultiselectObjDropdown.component";
import { FaLightbulb } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addJob } from "../../../services/jobs/JobsService";
import { toast } from "react-toastify";
import moment from "moment";
import { saveOrUpdateReport } from "../../../services/configurations/configService";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const RefreshModal = ({ reportName, modalData, showModal, setShowModal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const targetListForDropdown = useSelector(
    (state) =>
      state.jobs.targets?.filter(
        (target) => target.status !== "PENDING_APPROVAL"
      ) || []
  );
  const [selectedOption, setSelectedOption] = useState(
    modalData?.selectedOption
  );
  const [server, setServer] = useState(modalData?.serverData || []);
  const [column, setColumn] = useState(modalData?.columnData || []);
  const [loading, setLoading] = useState(false);
  const getUsernameFromCookie = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];

    return cookieValue ? decodeURIComponent(cookieValue) : "user";
  };
  const handleSelect = (value) => {
    // Deselect if same value is clicked
    if (value === "allData_refresh") {
      const updatedServers = server.map((el) => {
        return { ...el, checked: true };
      });
      const updatedColumns = column.map((el) => {
        return { ...el, checked: true };
      });
      setServer(updatedServers);
      setColumn(updatedColumns);
    }
    setSelectedOption(value);
  };

  const filterCommandsAcToColumns = (records, columns) => {
    const commands = [];
    for (let i = 0; i < columns.length; i++) {
      let cmdObj = {};
      for (let j = 0; j < records.length; j++) {
        if (Object.hasOwn(records[j], columns[i]) && records[j][columns[i]]) {
          cmdObj.actionDescription =
            records[j][columns[i]]["actionDescription"] || "";
          cmdObj.actionType = "Command";
          cmdObj.args = records[j][columns[i]]["args"];
          cmdObj.command = records[j][columns[i]]["command"];
          cmdObj.description = records[j][columns[i]]["description"];
          cmdObj.editMode = false;
          cmdObj.id = nanoid();
          cmdObj.osInstanceType = records[j][columns[i]]["osInstanceType"];
          cmdObj.outputVar = "";
          cmdObj.runAs = getUsernameFromCookie();
          cmdObj.subShell = records[j][columns[i]]["subShell"];
          cmdObj.tags = records[j][columns[i]]["tags"];
          commands.push(cmdObj);
          cmdObj = {};
        }
      }
    }
    return commands;
  };

  const prepareAddReportPayload = (column, server) => {
    //selectedColumns
    const selectedServers = server
      .filter((option) => option.checked)
      .map((option) => option.value);

    const selectedColumns = column
      .filter((option) => option.checked)
      .map((option) => {
        return {
          column: option.column,
          job: option.job,
          operator: option.operator,
          value: option.operator,
        };
      });

    const reportPayload = {
      columns: selectedColumns,
      description: `${modalData.reportDetails?.description} ${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}`,
      duration: modalData.reportDetails?.duration,
      jobs: [`Temp: ${reportName} refresh`],
      reportName: `${reportName} ${moment().format("YYYY-MM-DD HH:mm:ss")}`,
      tags: [],
    };
    return reportPayload;
  };

  const handleCreateReport = async (addReportPayload) => {
    try {
      const response = await dispatch(
        saveOrUpdateReport(addReportPayload)
      ).unwrap();
      if (response?.statusCode === 200) {
        toast.success("Report created successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        const _id = response?.data[0]?._id;
        history.push(`/report/my-reports/${_id}`);
      } else {
        toast.error(response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Failed to save/update report:", err);
      toast.error("Failed refresh data", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async () => {
    const selectedColumn = column
      .filter((option) => option.checked)
      .map((option) => option.value);
    const selectedServer = server
      .filter((option) => option.checked)
      .map((option) => option.value);
    const initialJobEndDate = new Date();
    initialJobEndDate.setHours(23, 59, 0, 0);
    initialJobEndDate.setDate(initialJobEndDate.getDate() + 1);
    const commands = filterCommandsAcToColumns(
      modalData?.records,
      selectedColumn
    );

    const payload = {
      categoryName: "Temporary Category",
      categoryType: `Local`,
      commands: commands,
      cronExpression: "",
      frequency: "Execute one time",
      hostname: selectedServer.join(","),
      isOneTime: true,
      jobDescription: `Temp: ${reportName} refresh ${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}`,
      jobEndDate: Date?.parse(initialJobEndDate),
      jobRunning: true,
      jobStartDate: Date?.parse(new Date()),
      jobTimeZone: "",
      privateJob: false,
      recurringTime: "0",
      runAs: getUsernameFromCookie(),
      runAsCurrentUser: true,
      scheduleType: "NORMAL",
      serverAttribute: "",
      serverAttributeValue: [],
      tags: "",
      target: targetListForDropdown[0]?.indexName
        ? [targetListForDropdown[0]?.indexName]
        : "",
      timeout: undefined,
    };

    const addReportPayload = prepareAddReportPayload(column, server);

    try {
      const response = await dispatch(addJob(payload));
      if (response?.data?.statusCode === 200) {
        setShowModal(false);
        await handleCreateReport(addReportPayload);
      } else {
        toast.error(response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalData?.serverData) {
      setServer(modalData?.serverData || []);
    }
    if (modalData?.columnData) {
      setColumn(modalData?.columnData || []);
    }
    if (modalData?.selectedOption) {
      setSelectedOption(modalData?.selectedOption || "allData_refresh");
    }
  }, [modalData?.serverData, modalData?.columnData, modalData?.selectedOption]);

  useEffect(() => {
    if (!showModal) {
      handleSelect("allData_refresh");
    }
  }, [showModal]);

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(!showModal)}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          margin: "auto",
          width: "550px",
          minHeight: "250px",
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 15px",
          borderBottom: "1px solid #cdcdcd",
        }}
      >
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "17px", fontWeight: "600" }}>
            Refresh Report Data
          </p>
          <p
            style={{
              cursor: "pointer",
              margin: 0,
              display: "flex",
              alignItems: "center",
              color: "rgb(129 133 141)",
            }}
            onClick={() => setShowModal(false)}
          >
            <RxCross2 size={22} />
          </p>
        </section>
        <p style={{ lineHeight: "1.3", margin: "0px" }}>
          <span style={{ color: "#464343" }}>
            Choose how you want to refresh this report. You can refresh
            everything, or limit to specific servers or columns
          </span>
        </p>
      </div>
      <div
        style={{
          fontWeight: "600",
          fontSize: "16px",
          marginTop: "20px",
          padding: "0px 30px",
        }}
      >
        Scope of Refresh
      </div>
      {/* Content with Copy Icon */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ width: "485px" }}>
          <div>
            <section
              onClick={() => handleSelect("allData_refresh")}
              style={{
                border:
                  selectedOption === "allData_refresh"
                    ? "2px solid #cde2fe"
                    : "1px solid #cdcdcd",
                backgroundColor:
                  selectedOption === "allData_refresh"
                    ? "#eff6ff"
                    : "transparent",
                display: "flex",
                padding: "5px 10px",
                borderRadius: "5px",
                gap: "15px",
                cursor: "pointer",
              }}
            >
              <div>
                <input
                  type="radio"
                  id="allData_refresh"
                  name="select"
                  checked={selectedOption === "allData_refresh"}
                />
              </div>
              <div>
                <span style={{ fontWeight: "600", fontSize: "15px" }}>
                  All Data
                </span>
                <br />
                <span style={{ color: "#464343" }}>
                  Refresh the entire report with latest data from all resources
                </span>
              </div>
            </section>
          </div>
          <div style={{ marginTop: "20px" }}>
            <section
              onClick={() => handleSelect("server_level_refresh")}
              style={{
                border:
                  selectedOption === "server_level_refresh"
                    ? "2px solid #cde2fe"
                    : "1px solid #cdcdcd",
                backgroundColor:
                  selectedOption === "server_level_refresh"
                    ? "#eff6ff"
                    : "transparent",
                display: "flex",
                padding: "5px 10px",
                borderRadius: "5px",
                gap: "15px",
                cursor: "pointer",
              }}
            >
              <div>
                <input
                  type="radio"
                  id="server_level_refresh"
                  name="select"
                  checked={selectedOption === "server_level_refresh"}
                />
              </div>
              <div>
                <span style={{ fontWeight: "600", fontSize: "15px" }}>
                  Server-Level Refresh
                </span>
                <br />
                <span style={{ color: "#464343" }}>
                  Refresh data from specific servers only
                </span>
              </div>
            </section>
            {selectedOption === "server_level_refresh" && (
              <section style={{ marginTop: "5px" }}>
                <MultiselectObjectDropdown
                  title={"Server"}
                  items={server}
                  setItems={setServer}
                  ddWidth={485}
                />
              </section>
            )}
          </div>
          <div style={{ marginTop: "20px" }}>
            <section
              onClick={() => handleSelect("column_level_refresh")}
              style={{
                border:
                  selectedOption === "column_level_refresh"
                    ? "2px solid #cde2fe"
                    : "1px solid #cdcdcd",
                backgroundColor:
                  selectedOption === "column_level_refresh"
                    ? "#eff6ff"
                    : "transparent",
                display: "flex",
                padding: "5px 10px",
                borderRadius: "5px",
                gap: "15px",
              }}
            >
              <div>
                <input
                  type="radio"
                  id="column_level_refresh"
                  name="select"
                  checked={selectedOption === "column_level_refresh"}
                />
              </div>
              <div>
                <span style={{ fontWeight: "600", fontSize: "15px" }}>
                  Column-Level Refresh
                </span>
                <br />
                <span style={{ color: "#464343" }}>
                  Refresh specific data columns only
                </span>
              </div>
            </section>
            {selectedOption === "column_level_refresh" && (
              <section style={{ marginTop: "5px" }}>
                <MultiselectObjectDropdown
                  title={"Column"}
                  items={column}
                  setItems={setColumn}
                  ddWidth={485}
                />
              </section>
            )}
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "7px",
              backgroundColor: "#fffbeb",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            <section style={{ color: "#f69f0b" }}>
              <FaLightbulb />
            </section>
            <section style={{ lineHeight: "1.3" }}>
              <span style={{ color: "#944110", fontWeight: "700" }}>
                Performance Tip:{" "}
              </span>
              <span style={{ fontSize: "13px", color: "#a76239" }}>
                Selective refresh options can significantly reduce processing
                time for large reports. Server + Column combination refreshes
                only the intersection of your selections.
              </span>
            </section>
          </div>
        </div>
        <div className="modal-actions" style={{ width: "100%" }}>
          <Button
            variant="outlined"
            onClick={() => setShowModal(false)}
            // disabled={loading}
            sx={{ borderRadius: "10px" }}
          >
            {"CANCEL"}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: "10px" }}
          >
            {loading ? "Refresh..." : "Refresh"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default RefreshModal;
