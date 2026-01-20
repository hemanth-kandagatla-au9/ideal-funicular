import { Box } from "@mui/material";
import { ReactNode } from "react";

interface FormFieldsContainerProps {
  children: ReactNode;
}

const FormFieldsContainer: React.FC<FormFieldsContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        padding: "8px 0",
      }}
    >
      {children}
    </Box>
  );
};

export default FormFieldsContainer;