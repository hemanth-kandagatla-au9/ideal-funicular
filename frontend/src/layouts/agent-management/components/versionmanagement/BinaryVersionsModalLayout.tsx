import { Modal, Box, Typography } from "@mui/material";
import { RxCross2 } from "react-icons/rx";

interface BinaryVersionsModalLayoutProps {
  open: boolean;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  title: string;
  children: React.ReactNode;
}

const modalStyle = {
  position: "absolute",
  top: "48%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "700px",
  maxHeight: "92vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: "30px",
  borderRadius: "16px",
  overflowY: "auto",
};

const BinaryVersionsModalLayout: React.FC<BinaryVersionsModalLayoutProps> = ({ open, onClose, title, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Box
            component="button"
            onClick={e => onClose(e, "escapeKeyDown")}
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              transition: "color 0.2s",
              "&:hover": {
                color: "#000000",
              },
            }}
            aria-label="Close"
          >
            <RxCross2 size={24} />
          </Box>
        </Box>
        {children}
      </Box>
    </Modal>
  );
};

export default BinaryVersionsModalLayout;
