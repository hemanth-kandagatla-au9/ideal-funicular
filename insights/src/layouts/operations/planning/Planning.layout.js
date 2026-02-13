/**
 * Component dependencies
 * */
import React, { useEffect, useState } from "react";
import classes from "./css/planning.module.css";
import SubHeader from "../../../components/planning/SubHeader.component";
import TaskList from "../../../components/planning/TaskList.component";
import { useHistory } from "react-router-dom";
import Sidebar from "../../../components/planning/Sidebar.component";
import { UI_TEXTS } from "../../../components/common/Constants/label-contants";
import { isLoadingInHost } from "../../../utils/DetectHost";

// Component
function Planning() {
  const history = useHistory();
  const user = sessionStorage.getItem("user");
  if (!user) {
    // history.push('/login'); // Redirect to login if user is not found
  }

  const [callApi, setCallApi] = useState(0);
  const [taskToEdit, setTaskToEdit] = useState([]);
  // set filter states to false on load
  const [planningFilters, setPlanningFilters] = useState({
    assetFilter: false,
    platformFilter: false,
    categoryFilter: false,
    hostFilter: false,
    categoryTypeFilter: false,
    TargetFilter: false,
    TagsFilter: false,
    FrequencyFilter: false,
    ScheduleByFilter: false,
    // actionTypeByFilter:false
  });

  const [activeTab, setActiveTab] = useState(UI_TEXTS.TABS_TEXT.JOBS);

  // integer state
  const [value, setValue] = useState(0);

  // Return html of planning component

  useEffect(() => {}, []);
  return (
    <div className={classes.mainContainer}>
      <div className={classes.topwrapper} data-testid="landingPageTestId">
        <SubHeader
          data-test="planner-layout-subheader"
          data-testid="subheader-test"
          modalIsOpen={value}
          taskDetails={taskToEdit}
        />
      </div>

      <div className={classes.contentWrapper}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className={classes.mainContent}>
          <div className={classes.planner_authLanding}>
            <TaskList
              data-test="planner-layout-tasklist"
              filters={planningFilters}
              setFilters={setPlanningFilters}
              callapi={callApi}
              isTestCase={false}
              showFilters={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
// export component
export default Planning;
