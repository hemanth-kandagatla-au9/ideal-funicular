/* eslint-disable */
import React from "react";
import { Accordion, Button, AccordionContext } from "react-bootstrap";
import { Typography } from "@mui/material";
import { convertDateTime } from "../../helpers/agentHelpers";
import { agentLogsTitle, copyToClipboardButtonText, loadingText, logDetailsTitle, refreshLogsButtonText } from "../../../../constants/strings";

interface AgentLogsProps {
  hostname: string;
  agentId: string;
  agentLog: any[];
  isLogsLoading: boolean;
  loadAgentLogs: (hostname: string, agentId: string | null, jobName: string) => Promise<void>;
  refreshAgentLogs: (hostname: string, agentId: string | null, jobName: string) => Promise<void>;
  copyToClipboard: (content: any) => void;
  logsBodyRef: React.RefObject<HTMLUListElement>;
}
const AgentLogs: React.FC<AgentLogsProps> = ({ hostname, agentId, agentLog, isLogsLoading, loadAgentLogs, refreshAgentLogs, copyToClipboard, logsBodyRef }) => {
  return (
    <Accordion.Item eventKey="3">
      <Accordion.Header className="accordionHead" onClick={() => loadAgentLogs(hostname, agentId, "")}>
        <AccordionContext.Consumer>
          {({ activeEventKey }) => (
            <>
              <Typography className={`accordionTitle ${activeEventKey === "3" ? "titleCollapsed" : "nottitleCollapsed"}`}>{agentLogsTitle}</Typography>
              <span className={`agentDetailsArrow ${activeEventKey !== "3" ? "collapsedSvg" : "notcollapsedSvg"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#102459" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </>
          )}
        </AccordionContext.Consumer>
      </Accordion.Header>
      <Accordion.Body className="logsBody">
        <div className="risebot_logDetails risebot_logRelative">
          <div className="risebot_agentLogsHeader">
            <Typography className="risebot_agentVersionsTitle">{logDetailsTitle}</Typography>
            <div>
              <Button variant="outline" title={refreshLogsButtonText} onClick={() => refreshAgentLogs(hostname, agentId, "")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <g clipPath="url(#clip0_695_2457)">
                    <path
                      d="M3.55978 9.87672C2.96583 12.1008 3.54128 14.5723 5.28614 16.3171C7.35034 18.3813 10.4314 18.8089 12.9169 17.5999M4.69689 7.47829L5.28614 6.88904C7.88964 4.28554 12.1107 4.28554 14.7142 6.88904C17.1422 9.31697 17.3059 13.1517 15.2054 15.7694M4.69689 7.47829L8.23242 7.47829M4.69689 7.47829L4.69689 3.94276"
                      stroke="#FFC400"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_695_2457">
                      <rect width="20" height="20" fill="white" transform="matrix(-1 0 0 1 20 0.769531)" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
              <Button variant="outline" title={copyToClipboardButtonText} onClick={() => copyToClipboard(agentLog)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <path
                    d="M5 9.93652C5 7.5795 5 6.40099 5.73223 5.66876C6.46447 4.93652 7.64298 4.93652 10 4.93652H12.5C14.857 4.93652 16.0355 4.93652 16.7678 5.66876C17.5 6.40099 17.5 7.5795 17.5 9.93652V14.1032C17.5 16.4602 17.5 17.6387 16.7678 18.371C16.0355 19.1032 14.857 19.1032 12.5 19.1032H10C7.64298 19.1032 6.46447 19.1032 5.73223 18.371C5 17.6387 5 16.4602 5 14.1032V9.93652Z"
                    stroke="#033EDA"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 16.6032C3.61929 16.6032 2.5 15.4839 2.5 14.1032V9.10319C2.5 5.96049 2.5 4.38915 3.47631 3.41283C4.45262 2.43652 6.02397 2.43652 9.16667 2.43652H12.5C13.8807 2.43652 15 3.55581 15 4.93652"
                    stroke="#033EDA"
                    strokeWidth="1.5"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <ul style={{ marginTop: "32px", marginBottom: "0px", paddingTop: "18px" }} ref={logsBodyRef}>
            {!isLogsLoading &&
              agentLog.map(({ timestamp, level, message }) => {
                const formattedTimestamp = convertDateTime(timestamp, "", false);
                return (
                  <li key={timestamp}>
                    <span
                      style={{
                        color: "#344054",
                        fontFamily: "Manrope",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "normal",
                      }}
                    >
                      {formattedTimestamp}
                    </span>
                    <span
                      style={{
                        color: "#344054",
                        fontFamily: "Manrope",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "normal",
                      }}
                    >
                      | {level} | {message}
                    </span>
                  </li>
                );
              })}
          </ul>
          {isLogsLoading && (
            <div className="risebot_spinnerLoader">
              <div className="risebot_innerSpinner">
                <div className="spinner-border" role="status">
                  <span className="sr-only">{loadingText}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AgentLogs;
