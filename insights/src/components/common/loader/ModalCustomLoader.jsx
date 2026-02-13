import { Box, CircularProgress } from "@mui/material";
import "./ModalCustomLoader.css";
const ModalCustomLoader = ({ isLoading, parentClassName, className }) => {
  return (
    <Box
      display={isLoading ? "flex" : "none"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <CircularProgress className="custom-loader" />
    </Box>
  );
};

export default ModalCustomLoader;
