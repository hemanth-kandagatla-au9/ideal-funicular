import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import classes from "./job.module.css";

import {
  updatedMinutesOption,
  weekOptions,
  dayOptions,
  hourOptions,
  minuteOptions,
  showDropdownOption,
} from "./cronOptionsData";
import CronMultiSelect from "./CronMultiSelect.component";
import { UI_TEXTS } from "../common/Constants/label-contants";

const Scheduler = ({
  modelOpen,
  showDropdown,
  setShowDropdown,
  cronExp,
  setCronExp,
  viewOnly,
  jobStartDate,
  setJobStartDate,
  jobEndDate,
  setJobEndDate,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState("*");
  const [selectedHours, setSelectedHours] = useState("*");
  const [selectedDays, setSelectedDays] = useState("*");
  const [selectedWeeks, setSelectedWeeks] = useState("*");
  const [selectedMonths, setSelectedMonths] = useState("*");
  const [isMinuteRequired, setIsMinuteRequired] = useState(false);
  const [isMonthRequired, setIsMonthRequired] = useState(false);
  const [startDateZIndex, setStartDateZIndex] = useState(2);
  const [endDateZIndex, setEndDateZIndex] = useState(1);

  let updatedDropdownOption = showDropdownOption;
  if (modelOpen === true) {
    updatedDropdownOption = showDropdownOption.filter(
      (s) => s.label !== "Execute one time"
    );
  }

  const setDropdown = (value) => {
    setShowDropdown(value);
    if (value === "Minutes") {
      setIsMinuteRequired(true);
    } else {
      setIsMinuteRequired(false);
    }
    if (value === "Monthly") {
      setIsMonthRequired(true);
    } else {
      setIsMonthRequired(false);
    }
    clearAllSelection();
  };

  const clearAllSelection = () => {
    setSelectedMinutes("*");
    setSelectedHours("*");
    setSelectedDays("*");
    setSelectedWeeks("*");
    setSelectedMonths("*");
  };

  const handleMinuteSelectChange = (value) => {
    setSelectedMinutes(typeof value === "string" ? value.split(",") : value);
  };

  const handleHourSelectChange = (value) => {
    setSelectedHours(
      typeof value === "string"
        ? value.split(",")
        : value.filter((val) => val !== "")
    );
  };

  const handleDaySelectChange = (value) => {
    setSelectedDays(
      typeof value === "string"
        ? value.split(",")
        : value.filter((val) => val !== "")
    );
  };

  useEffect(() => {
    let updatedMinutes = selectedMinutes;
    let updatedHours = selectedHours;
    let updatedWeeks = selectedWeeks;
    let updatedDays = selectedDays;

    if (showDropdown === "Minutes") {
      updatedMinutes = `*/${selectedMinutes}`;
    }

    if (showDropdown === "Hourly") {
      if (selectedMinutes === "*") {
        updatedMinutes = `0`;
      }
    }

    if (showDropdown === "Daily") {
      if (selectedHours === "*") {
        updatedHours = `0`;
      }
      if (selectedMinutes === "*") {
        updatedMinutes = `0`;
      }
    }

    if (showDropdown === "Weekly") {
      if (selectedWeeks === "*") {
        updatedWeeks = `SUN`;
        setSelectedWeeks(["SUN"]);
      }
      if (selectedHours === "*") {
        updatedHours = `0`;
      }
      if (selectedMinutes === "*") {
        updatedMinutes = `0`;
      }
    }

    if (showDropdown === "Weekdays") {
      if (selectedWeeks === "*") {
        updatedWeeks = `MON,TUE,WED,THU,FRI`;
        setSelectedWeeks(["MON", "TUE", "WED", "THU", "FRI"]);
      }
      if (selectedHours === "*") {
        updatedHours = `0`;
      }
      if (selectedMinutes === "*") {
        updatedMinutes = `0`;
      }
    }

    if (showDropdown === "Monthly") {
      if (selectedDays === "*") {
        updatedDays = `1`;
        setSelectedDays(["1"]);
      }
      if (selectedHours === "*") {
        updatedHours = `0`;
      }
      if (selectedMinutes === "*") {
        updatedMinutes = `0`;
      }
    }

    setCronExp(
      `${updatedMinutes} ${updatedHours} ${updatedDays} ${selectedMonths} ${updatedWeeks}`
    );
  }, [
    showDropdown,
    selectedMinutes,
    selectedHours,
    selectedDays,
    selectedWeeks,
    selectedMonths,
  ]);

  const toggleWeekSelection = (week) => {
    setSelectedWeeks((prevSelectedWeeks) => {
      if (prevSelectedWeeks.includes(week)) {
        if (prevSelectedWeeks.length === 1) {
          return prevSelectedWeeks;
        }

        return prevSelectedWeeks
          .filter((w) => w !== week)
          .filter((val) => val !== "");
      } else {
        return [...prevSelectedWeeks, week].filter((val) => val !== "");
      }
    });
  };

  useEffect(() => {
    if (cronExp) {
      const [minutes, hours, days, months, weeks] = cronExp.split(" ");

      setSelectedMinutes(minutes.split("/").pop().split(","));
      setSelectedHours(hours.split(","));
      setSelectedDays(days.split(","));
      setSelectedMonths(months.split(","));
      setSelectedWeeks(weeks.split(","));
    }
  }, []);

  useEffect(() => {
    let jobStartInitial = new Date(jobStartDate);
    // jobStartInitial.setHours(0);
    // jobStartInitial.setMinutes(0);
    // jobStartInitial.setSeconds(0);
    setJobStartDate(jobStartInitial);

    let jobEndInitial = new Date(jobEndDate);
    // jobEndInitial.setHours(23);
    // jobEndInitial.setMinutes(59);
    // jobEndInitial.setSeconds(59);
    setJobEndDate(jobEndInitial);
  }, []);

  const handleStartDateChange = (date, setDate) => {
    const updatedDate = new Date(date);
    // updatedDate.setHours(0);
    // updatedDate.setMinutes(0);
    // updatedDate.setSeconds(0);
    setDate(updatedDate);
  };

  const handleEndDateChange = (date, setDate) => {
    const updatedDate = new Date(date);
    // updatedDate.setHours(23);
    // updatedDate.setMinutes(59);
    // updatedDate.setSeconds(59);
    setDate(updatedDate);
  };

  console.log("jobStartDate => ", jobStartDate);
  console.log("jobEndDate => ", jobEndDate);

  return (
    <div className={classes.schedulerContainer}>
      <div className={classes.formRow}>
        <div
          className="custom-input-wrapper"
          style={{ zIndex: startDateZIndex }}
          onFocus={() => {
            setStartDateZIndex(2);
            setEndDateZIndex(1);
          }}
        >
          <label className="custom-label">
            {UI_TEXTS.LABELS.JOB_START_DATE}
          </label>
          {/* <DatePicker */}
          <ReactDatePicker
            selected={jobStartDate}
            className={classes.custom_input_date}
            onChange={(date) => handleStartDateChange(date, setJobStartDate)}
            timeIntervals={1}
            dateFormat="Pp"
            disabled={viewOnly}
            placeholderText={UI_TEXTS.PLACEHOLDERS.START_DATE}
            showTimeSelect
          />
        </div>
      </div>

      <div className={classes.formRow}>
        <div className={classes.inputContainer}>
          <div className={classes.frequencyContainer}>
            <div className={classes.frequencySelect}>
              <CronMultiSelect
                labelName={UI_TEXTS.LABELS.REPEAT_EVERY}
                labelsforUI={modelOpen}
                isDisabled={viewOnly}
                options={updatedDropdownOption}
                onChange={setDropdown}
                placeHolderText={UI_TEXTS.PLACEHOLDERS.SELECT_FREQUENCY}
                value={[showDropdown]}
              />
            </div>
            {showDropdown === "Minutes" && (
              <div className={classes.minuteSelect}>
                <CronMultiSelect
                  isRequired={isMinuteRequired}
                  isDisabled={viewOnly}
                  labelName={UI_TEXTS.LABELS.MINUTE}
                  options={minuteOptions}
                  onChange={handleMinuteSelectChange}
                  placeHolderText={UI_TEXTS.PLACEHOLDERS.SELECT_MINUTE}
                  value={selectedMinutes === "*" ? [""] : selectedMinutes}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showDropdown === "Monthly" && (
        <div className={classes.formRow}>
          <div className={classes.labelContainer}>
            <p className={classes.iabot_p_tag_scheduler}>
              {UI_TEXTS.LABELS.ON_DATE}
              {"  "}
            </p>
          </div>
          <div className={classes.inputContainer}>
            <CronMultiSelect
              isRequired={isMonthRequired}
              isDisabled={viewOnly}
              isMultiSelect={true}
              labelName={UI_TEXTS.LABELS.DATE}
              options={dayOptions}
              onChange={handleDaySelectChange}
              placeHolderText="Day of month"
              value={selectedDays === "*" ? [""] : selectedDays}
            />
          </div>
        </div>
      )}

      {(showDropdown === "Weekly" || showDropdown === "Weekdays") && (
        <div className={classes.formRow}>
          <div className={classes.labelContainer}></div>
          <div className={classes.inputContainer}>
            <div className={classes.weekButtonsContainer}>
              {weekOptions.map((week, index) => (
                <button
                  key={index}
                  data-testid={`week-button-${index}`}
                  onClick={() => toggleWeekSelection(week?.value)}
                  className={`${classes.weekButton} ${
                    selectedWeeks.includes(week?.value)
                      ? classes.weekButtonActive
                      : ""
                  }`}
                >
                  {week?.labelUI}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDropdown !== "Minutes" && (
        <div className={classes.formRow}>
          <div className={classes.labelContainer}>
            <p className={classes.iabot_p_tag_scheduler}>
              {UI_TEXTS.LABELS.AT}
              {"  "}
            </p>
          </div>
          <div className={classes.inputContainer}>
            <div className={classes.timeContainer}>
              {showDropdown !== "Hourly" && (
                <>
                  <div className={classes.hourSelect}>
                    <CronMultiSelect
                      isDisabled={viewOnly}
                      isMultiSelect={true}
                      labelName={UI_TEXTS.LABELS.HOUR}
                      options={hourOptions}
                      onChange={handleHourSelectChange}
                      placeHolderText={UI_TEXTS.PLACEHOLDERS.MIDNIGHT}
                      value={selectedHours === "*" ? [""] : selectedHours}
                    />
                  </div>
                  <span className={classes.timeSeparator}>:</span>
                </>
              )}
              <div className={classes.minuteSelect}>
                <CronMultiSelect
                  isRequired={isMinuteRequired}
                  isDisabled={viewOnly}
                  labelName={UI_TEXTS.LABELS.MINUTE}
                  options={updatedMinutesOption}
                  onChange={handleMinuteSelectChange}
                  placeHolderText={UI_TEXTS.PLACEHOLDERS.SELECT_MINUTE}
                  value={selectedMinutes === "*" ? [""] : selectedMinutes}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={classes.formRow}>
        <div
          className="custom-input-wrapper"
          style={{ zIndex: endDateZIndex }}
          onFocus={() => {
            setStartDateZIndex(1);
            setEndDateZIndex(2);
          }}
        >
          <label className="custom-label">{UI_TEXTS.LABELS.JOB_END_DATE}</label>
          {/* <DatePicker */}
          <ReactDatePicker
            className={classes.custom_input_date}
            selected={jobEndDate}
            onChange={(date) => handleEndDateChange(date, setJobEndDate)}
            timeIntervals={1}
            dateFormat="Pp"
            disabled={viewOnly}
            placeholderText={UI_TEXTS.PLACEHOLDERS.END_DATE}
            showTimeSelect
          />
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
