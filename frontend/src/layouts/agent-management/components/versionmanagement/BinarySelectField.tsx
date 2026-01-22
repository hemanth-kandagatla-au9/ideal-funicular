import { FormControl, Select, MenuItem, FormHelperText, Typography, SelectChangeEvent } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface SelectFieldProps {
  name: string;
  label: string;
  value: string | string[];
  options: string[];
  onChange: (event: SelectChangeEvent<string | string[]>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  inputStyles?: SxProps<Theme>;
  selectMenuStyles?: SxProps<Theme>;
}

const BinarySelectField: React.FC<SelectFieldProps> = ({ name, label, value, options, onChange, onBlur, error, touched, multiple = false, disabled = false, inputStyles, selectMenuStyles }) => {
  return (
    <FormControl fullWidth sx={inputStyles} error={touched && Boolean(error)}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Select name={name} value={value} onChange={onChange} onBlur={onBlur} multiple={multiple} disabled={disabled} displayEmpty MenuProps={{ sx: selectMenuStyles }} sx={{ borderRadius: "8px" }}>
        <MenuItem disabled value="">
          <em>Select {label.toLowerCase()}</em>
        </MenuItem>
        {Array.isArray(options) &&
          options.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{touched && error ? error : " "}</FormHelperText>
    </FormControl>
  );
};

export default BinarySelectField;

