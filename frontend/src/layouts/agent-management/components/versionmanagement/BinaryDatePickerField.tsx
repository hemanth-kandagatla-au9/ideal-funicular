import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, Typography, Box, SxProps, Theme } from "@mui/material";
import { format } from "date-fns";

interface DatePickerFieldProps {
  name: string;
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  inputStyles?: SxProps<Theme>;
  showToday?: boolean;
}

const BinaryDatePickerField: React.FC<DatePickerFieldProps> = ({ name, label, value, onChange, onBlur, error, touched, inputStyles, showToday = true }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        <DatePicker
          value={value}
          onChange={onChange}
          enableAccessibleFieldDOMStructure={false}
          slots={{
            textField: TextField,
          }}
          slotProps={{
            textField: {
              name,
              fullWidth: true,
              placeholder: showToday ? format(new Date(), "MM/dd/yyyy") : "MM/DD/YYYY",
              sx: {
                ...inputStyles,
                width: "300px !important",
                borderRadius: "8px",
              },
              error: touched && Boolean(error),
              helperText: touched && error ? error : " ",
              onBlur,
            },
            popper: {
              sx: {
                zIndex: 1300,
                "& .MuiPaper-root": {
                  "& .Mui-selected": {
                    backgroundColor: "#2961F4 !important",
                    color: "white !important",
                  },
                  "& .MuiPickersDay-root:hover": {
                    backgroundColor: "#2961F4 !important",
                    color: "white !important",
                  },
                },
              },
            },
            day: {
              sx: {
                "&.Mui-selected": {
                  backgroundColor: "#2961F4 !important",
                  color: "white !important",
                },
                "&.MuiPickersDay-today": {
                  borderColor: "#2961F4 !important",
                  backgroundColor: "#2961F4 !important",
                  color: "#FFFFFF !important",
                },
                "&:hover": {
                  backgroundColor: "#2961F4 !important",
                  color: "white !important",
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default BinaryDatePickerField;

