import { Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import { isEmpty } from "lodash";
import { Accordion, AccordionContext } from "react-bootstrap";
import React from "react";
import AgentConfigurationProps from "@/types/AgentConfigurationProps";
import { agentConfigurationTitle, configurationTitle } from "../../../../constants/strings";

const AgentConfiguration: React.FC<AgentConfigurationProps> = ({ applicationProperty, trimAgentPropertyName }) => {
  return (
    <Accordion.Item eventKey="2">
      <Accordion.Header className="riseagent-accordionHead">
        <AccordionContext.Consumer>
          {({ activeEventKey }) => (
            <>
              <Typography
                className={`riseagent-accordionTitle ${activeEventKey === "2" ? "riseagent-titleCollapsed" : "riseagent-nottitleCollapsed"}`}
              >
                {agentConfigurationTitle}
              </Typography>
              <span
                className={`riseagent-agentDetailsArrow ${activeEventKey !== "2" ? "riseagent-collapsedSvg" : "riseagent-notcollapsedSvg"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#102459" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </>
          )}
        </AccordionContext.Consumer>
      </Accordion.Header>
      <Accordion.Body>
        <div className="riseagent-risebot_configDetails">
          <div className="riseagent-risebot_configTitle">
            <p>{configurationTitle}</p>
          </div>
          <div className="riseagent-risebot_agentdetailsBodyConfig">
            <TableContainer component={Paper} sx={{ boxShadow: 0, maxHeight: 400, overflow: "auto" }}>
              <Table size="small" aria-label="agent configuration table" sx={{ minWidth: 280 }}>
                <TableBody>
                  {!isEmpty(applicationProperty) &&
                    Object.keys(applicationProperty).map(el => (
                      <TableRow key={el}>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          sx={{ fontWeight: 500, color: "#333", fontSize: { xs: 13, sm: 15 }, px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 }, wordBreak: "break-word", maxWidth: 210 }}
                        >
                          {trimAgentPropertyName(el)}
                        </TableCell>
                        <TableCell align="center" sx={{ width: 10, fontWeight: 700, color: "#888", fontSize: { xs: 13, sm: 15 } }}>
                          {" "}
                          :{" "}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ color: "#555", fontSize: { xs: 13, sm: 15 }, px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 }, wordBreak: "break-word", maxWidth: 220 }}
                        >
                          {applicationProperty[el]}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AgentConfiguration;
