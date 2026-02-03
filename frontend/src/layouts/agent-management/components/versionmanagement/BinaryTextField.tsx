import { FormHelperText, TextField, Typography, FormControl } from "@mui/material";
import { FC } from "react";

interface BinaryTextFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  inputStyles?: any;
  disabled?: boolean;
}

const BinaryTextField: FC<BinaryTextFieldProps> = ({ name, label, value, onChange, onBlur, error, touched, placeholder, inputStyles, disabled = false }) => {
  const shouldShowError = touched && Boolean(error);

  return (
    <FormControl fullWidth sx={inputStyles} error={shouldShowError}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={shouldShowError}
        placeholder={placeholder}
        fullWidth
        size="small"
        disabled={disabled}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px !important",
            height: "55px !important",
            "&.Mui-focused fieldset": { borderColor: "#2961F4 !important" },
            "&.Mui-disabled": { backgroundColor: "#f5f5f5" },
          },
        }}
      />
      <FormHelperText>{shouldShowError ? error : " "}</FormHelperText>
    </FormControl>
  );
};

export default BinaryTextField;
