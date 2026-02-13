import React, { useState } from "react";
import "./css/tasks.css";
import LoadingData from "../ui/loading-data/loadingData.Component";
import NoDataFound from "../ui/no-data-found/noDataFound.Component";
import { SideDrawerAddJob } from "./SideDrawerAddJob.component";
import { HostsModal } from "./HostsModal";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import { getJobById } from "../../services/jobs/JobsService";
import { useDispatch } from "react-redux";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { UI_TEXTS } from "../common/Constants/label-contants";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#faf9f7",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 13,
    fontWeight: 500,
    padding: 0,
    border: "1px solid #d8d8d8",
    borderRadius: "4px",
    marginTop: "1px !important",
  },
}));

const TagCards = ({ data, isLoading }) => {
  const dispatch = useDispatch();
  const [isNodesModalOpen, setIsNodesModalOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState({
    jobId: null,
    tagName: "",
  });
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);
  const [jobSelectedData, setJobSelectedData] = useState({});

  const fetchJobDetails = async (id) => {
    const response = await dispatch(getJobById(id));
    return response;
  };
  const handleJobClick = (job, tagName) => {
    if (
      activeDropdown.jobId === job.jobId &&
      activeDropdown.tagName === tagName
    ) {
      setActiveDropdown({ jobId: null, tagName: "" });
    } else {
      setActiveDropdown({ jobId: job.jobId, tagName: tagName });
      setTooltipOpen(true);
    }
    setJobId(job.jobId);
  };

  const handleOptionClick = async (option, id) => {
    setActiveDropdown({ jobId: null, tagName: "" });
    setTooltipOpen(false);
    if (option === "Job") {
      const response = await fetchJobDetails(id);
      setJobSelectedData(response?.data?.jobDetails);
      setJobOpen(true);
    } else if (option === "Host") {
      setIsNodesModalOpen(true);
    }
  };

  const setJobOpenToFalse = () => {
    setJobOpen(false);
  };

  const transformedData = data?.map((eachCard, index) => ({
    ...eachCard,
    id: `tag-${eachCard.tagName}-${index}`,
    target: eachCard.tagName,
    jobs: eachCard.jobs,
  }));

  const columns = [
    { field: "target", headerName: UI_TEXTS.HEADER_TEXT.TARGET, flex: 1 },
    {
      field: "jobs",
      headerName: UI_TEXTS.HEADER_TEXT.JOBS,
      flex: 2,
      renderCell: (params) => {
        const jobs = params.value || [];

        // Define row-based color rotations for jobs
        const jobColorSets = [
          [
            { background: "#E3FCEF", color: "#027A48" },
            { background: "#FEF3C7", color: "#B45309" },
            { background: "#DBEAFE", color: "#2563EB" },
            { background: "#FDE2E4", color: "#D62F46" }
          ],
          [
            { background: "#FEF3C7", color: "#B45309" },
            { background: "#DBEAFE", color: "#2563EB" },
            { background: "#FDE2E4", color: "#D62F46" },
            { background: "#E3FCEF", color: "#027A48" }
          ],
          [
            { background: "#DBEAFE", color: "#2563EB" },
            { background: "#FDE2E4", color: "#D62F46" },
            { background: "#E3FCEF", color: "#027A48" },
            { background: "#FEF3C7", color: "#B45309" }
          ],
          [
            { background: "#FDE2E4", color: "#D62F46" },
            { background: "#E3FCEF", color: "#027A48" },
            { background: "#FEF3C7", color: "#B45309" },
            { background: "#DBEAFE", color: "#2563EB" }
          ]
        ];

        // Get correct row index for color rotation
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id) % 4;
        const jobColors = jobColorSets[rowIndex];

        return (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {jobs.map((job, index) => {
              const style = jobColors[index % jobColors.length]; // Assign color in sequence
              return (
                <LightTooltip
                  key={job.jobId}
                  open={
                    tooltipOpen &&
                    activeDropdown.jobId === job.jobId &&
                    activeDropdown.tagName === params.row.target
                  }
                  title={
                    <div className="iabot-tagsview-dropdown">
                      <div
                        className="iabot-tagsview-option"
                        onClick={() => handleOptionClick("Job", job.jobId)}
                      >
                        {UI_TEXTS.LABELS.JOB}
                      </div>
                      <div
                        className="iabot-tagsview-option"
                        onClick={() => handleOptionClick("Host", job.jobId)}
                      >
                        {UI_TEXTS.LABELS.HOST}
                      </div>
                    </div>
                  }
                >
                  <div
                    className="iabot_tagCards_jobs jobs-tags"
                    onClick={(event) =>
                      handleJobClick(job, params.row.target, event)
                    }
                    style={{
                      padding: "4px 12px",
                      backgroundColor: style.background, // Apply background color
                      color: style.color, // Apply text color
                      borderRadius: "50px",
                      cursor: "pointer",
                    }}
                  >
                    {job.jobName}
                  </div>
                </LightTooltip>
              );
            })}
          </div>
        );
      }
    }
  ];

  return (
    <div
      className="iabot_jobsList_cardsTable_container"
      data-testid="task-list-container"
    >
      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <LoadingData />
        </div>
      ) : (
        <div>
          {data?.length !== 0 ? (
            <div>
              <CustomDataGrid
                rows={transformedData}
                columns={columns}
                rowCount={transformedData?.length}
                paginationMode="client"
                sortingMode="client"
                hideFooter={true}
                getRowId={(row) => row.id}
              />

              <HostsModal
                jobId={jobId}
                isModalOpen={isNodesModalOpen}
                setIsModelOpen={setIsNodesModalOpen}
              />

              <SideDrawerAddJob
                modalIsOpen={jobOpen}
                setModalIsOpenToFalse={setJobOpenToFalse}
                singleJob={jobSelectedData}
                isEditClicked={true}
              />
            </div>
          ) : (
            <div style={{ textAlign: "center" }} colSpan={12}>
              <NoDataFound />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagCards;
