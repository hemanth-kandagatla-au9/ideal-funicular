import { Box, Button, CircularProgress } from "@mui/material";

interface FormButtonsProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
  isViewMode?: boolean;
  hasChanges?: boolean;
}

const BinaryFormButtons: React.FC<FormButtonsProps> = ({ 
  onCancel, 
  isEditing, 
  isSubmitting = false, 
  isViewMode = false,
  hasChanges = true
}) => {
  const getButtonText = () => {
    if (isViewMode) {
      return "Close";
    }
    if (isSubmitting) {
      return isEditing ? "Updating..." : "Adding...";
    }
    return isEditing ? "Update" : "Add";
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
      <Button
        type="button"
        onClick={onCancel}
        variant="outlined"
        disabled={isSubmitting}
        sx={{
          margin: "0 8px",
          minWidth: "100px",
          color: "#2961F4",
          borderColor: "#2961F4",
          borderRadius: "36px",
          "&:hover": {
            borderColor: "#2961F4",
          },
          "&:disabled": {
            borderColor: "#2961F4",
            color: "#2961F4",
          },
        }}
      >
        {isViewMode ? "Close" : "Cancel"}
      </Button>
      {!isViewMode && (
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || (isEditing && !hasChanges)}
          sx={{
            margin: "0 8px",
            minWidth: "100px",
            backgroundColor: "#2961F4",
            borderRadius: "36px",
            "&:hover": {
              backgroundColor: "#2961F4",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            },
          }}
        >
          {isSubmitting && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
          {getButtonText()}
        </Button>
      )}
    </Box>
  );
};

export default BinaryFormButtons;

