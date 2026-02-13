import React, { useEffect, useRef } from "react";
import $ from "jquery";
import moment from "moment";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-daterangepicker/daterangepicker.css";

// JS
import "bootstrap-daterangepicker";

const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  borderRadius = "12px",
}) => {
  const inputRef = useRef(null);

  // Format input text from props
  const updateInputValue = (start, end) => {
    if (start && end) {
      inputRef.current.value = `${start} - ${end}`;
    } else {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    const input = $(inputRef.current);

    input.daterangepicker(
      {
        opens: "left",
        autoUpdateInput: false,
        alwaysShowCalendars: true,

        startDate: startDate ? moment(startDate) : moment(),
        endDate: endDate ? moment(endDate) : moment(),

        locale: {
          format: "YYYY-MM-DD",
          cancelLabel: "Clear",
        },

        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, "days"),
            moment().subtract(1, "days"),
          ],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
        },
      },

      function (start, end) {
        // update parent state
        const s = start.format("YYYY-MM-DD");
        const e = end.format("YYYY-MM-DD");

        setStartDate(s);
        setEndDate(e);

        updateInputValue(s, e);
      }
    );

    // Apply button
    input.on("apply.daterangepicker", function (ev, picker) {
      const s = picker.startDate.format("YYYY-MM-DD");
      const e = picker.endDate.format("YYYY-MM-DD");

      setStartDate(s);
      setEndDate(e);

      updateInputValue(s, e);
    });

    // Cancel (Clear)
    input.on("cancel.daterangepicker", function () {
      setStartDate(null);
      setEndDate(null);
      input.val("");
    });

    return () => {
      input.data("daterangepicker")?.remove();
    };
  }, []);

  // When parent values change, update input box
  useEffect(() => {
    updateInputValue(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <input
      type="text"
      className="form-control"
      ref={inputRef}
      placeholder="Select date range"
      style={{ borderRadius: borderRadius, cursor: "pointer" }}
    />
  );
};

export default DateRangePicker;
