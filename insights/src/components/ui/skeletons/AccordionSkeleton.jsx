import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AccordionSkeleton = () => {
  return (
    <div>
      {[...Array(4)].map((_, index) => (
        <Accordion
          key={index}
          disabled
          sx={{
            marginBottom: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            backgroundColor: "#f8f8f8 !important",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            sx={{
              backgroundColor: "ffffff !important",
              borderRadius: "8px",
              minHeight: "60px",
            }}
          >
            <Skeleton variant="text" width="60%" height={28} />
          </AccordionSummary>
          <AccordionDetails>
            <Skeleton
              variant="rectangular"
              height={80}
              sx={{ mb: 1, borderRadius: 1 }}
            />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AccordionSkeleton;
