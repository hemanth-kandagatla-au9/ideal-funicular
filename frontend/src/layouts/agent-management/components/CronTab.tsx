/**
 * Cron Tab Module
 */
import React from "react";
import { Input as AntdInput } from "antd";
import Cron from "react-js-cron";
import "react-js-cron/dist/styles.css";
import "antd/dist/antd.css";
import "../css/agentStyle.css";
import "./CronTab.css";
import { clearAllButtonText, cronExpressionText } from "../../../constants/strings";

/**
 * This the module which is helped to create Job Scheduling
 * @param {*} props
 * @returns
 */

interface CronTabProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const CronTab = (props: CronTabProps) => {
  const { value, onChange, onClear } = props;

  return (
    <div data-testid="cronTab">
      <div className="formLabel scheduleLabel">{cronExpressionText}</div>
      <AntdInput value={value} className="risebotcronInput" />

      <div className="cron-wrapper">
        <Cron value={value} setValue={onChange} />

        <button type="button" className="clear-button" onClick={onClear}>
          {clearAllButtonText}
        </button>
      </div>
    </div>
  );
};

export default CronTab;
