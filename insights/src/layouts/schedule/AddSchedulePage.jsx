import React, { useEffect, useState } from "react";
import "./AddSchedulePage.css";
import SubHeader from "../../components/planning/SubHeader.component";
import { useParams, useHistory } from "react-router-dom";
import { AddJobComponent } from "../../components/planning/AddJob.component";
import { getJobDetailsByIdApi } from "../../services/jobs/JobsService";
import ModalCustomLoader from "../../components/common/loader/ModalCustomLoader";
import { useDispatch, useSelector } from "react-redux";
import { getTemplateDetails } from "../../store/TemplateSlice/templateSlice";

// Component
function AddSchedulePage() {
  const Loader = (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ModalCustomLoader isLoading={true} />
    </div>
  );
  const dispatch = useDispatch();
  const marketPlaceTemplates = useSelector((store) =>
    store.templates?.templateData?.data?.filter((template) => {
      return template.templateType !== "CMDB_API";
    })
  );
  console.log("AddSchedulePage mounted");

  console.log("check templates:::::::::::", marketPlaceTemplates);
  const history = useHistory();
  const { id } = useParams();
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      fetchJobDetails(id);
    } else {
      setLoading(false); // No ID = new schedule
    }
  }, [id]);

  const fetchJobDetails = async (jobId) => {
    try {
      const response = await getJobDetailsByIdApi(jobId);
      if (response?.success) {
        setTaskToEdit(response?.data);
      }
    } catch (error) {
      console.error("Error fetching job details:::::::", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      await dispatch(getTemplateDetails());
    };
    fetchTemplates();
  }, []);

  if (loading) return Loader;

  return (
    <div className="mainContainer">
      <div className="topwrapper" data-testid="landingPageTestId">
        <SubHeader
          data-test="planner-layout-subheader"
          data-testid="subheader-test"
          modalIsOpen={0}
          taskDetails={taskToEdit}
        />
      </div>

      <div className="contentWrapper">
        <AddJobComponent
          modalIsOpen={false}
          setModalIsOpenToFalse={() => {}}
          singleJob={taskToEdit || ""}
          isEditClicked={!!taskToEdit}
          setIsEditClicked={() => {}}
          componentTriggered={"TaskListCards"}
          codeTemplates={marketPlaceTemplates || []}
        />
      </div>
    </div>
  );
}

export default AddSchedulePage;
