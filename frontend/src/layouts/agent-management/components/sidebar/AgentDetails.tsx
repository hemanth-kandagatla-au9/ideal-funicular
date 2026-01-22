import React from "react";
import { Accordion, AccordionContext } from "react-bootstrap";
import { Skeleton, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import { agentDetailsTitle } from "../../../../constants/strings";

interface AgentDetailsProps {
  agentDetails: { label: string; value: string }[];
  agentDetailsLoading: boolean;
}

const AgentDetails: React.FC<AgentDetailsProps> = ({ agentDetails, agentDetailsLoading }) => {
  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header className="accordionHead">
        <AccordionContext.Consumer>
          {({ activeEventKey }) => (
            <>
              <Typography className={`accordionTitle ${activeEventKey === "1" ? "titleCollapsed" : "nottitleCollapsed"}`}>{agentDetailsTitle}</Typography>
              <span className={`agentDetailsArrow ${activeEventKey !== "1" ? "collapsedSvg" : "notcollapsedSvg"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#102459" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </>
          )}
        </AccordionContext.Consumer>
      </Accordion.Header>
      <Accordion.Body>
        <div className="risebot_agentdetailsBodyConfig">
          <TableContainer component={Paper} sx={{ boxShadow: 0, maxHeight: 400, overflow: "auto" }}>
            <Table size="small" aria-label="agent details table" sx={{ minWidth: 280 }}>
              <TableBody>
                {agentDetails.map(({ label, value }) => (
                  <TableRow key={label}>
                    <TableCell
                      component="th"
                      scope="row"
                      align="left"
                      sx={{ fontWeight: 500, color: "#333", fontSize: { xs: 13, sm: 15 }, px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 }, wordBreak: "break-word", maxWidth: 180 }}
                    >
                      {label}
                    </TableCell>
                    <TableCell align="center" sx={{ width: 10, fontWeight: 700, color: "#888", fontSize: { xs: 13, sm: 15 } }}>
                      :
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ color: "#555", fontSize: { xs: 13, sm: 15 }, px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 }, wordBreak: "break-word", maxWidth: 220 }}
                    >
                      {agentDetailsLoading ? <Skeleton animation="wave" variant="text" width="100px" height={20} /> : value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AgentDetails;

