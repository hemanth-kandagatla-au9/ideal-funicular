import { FormikProps } from "formik";
import { FormControlLabel, Switch, styled, Box, Typography, Button, Grid, Paper, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import BinarySelectField from "./BinarySelectField";
import BinaryDatePickerField from "./BinaryDatePickerField";
import BinaryTextField from "./BinaryTextField";

type FormValues = {
  _id:string,
  version: string;
  osCompatibility: string;
  osVersion: string;
  osEntries: { os: string; version: string }[];
  status: string;
  upgradeType: string;
  isMandatory: boolean;
  s3Url: string;
  releaseDate: Date | null;
  rustcversion: string;
};

type FieldProps = {
  formik: FormikProps<FormValues>;
  isEditing: boolean;
  isViewMode?: boolean;
};

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 30,
  height: 16,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 1,
    transitionDuration: "200ms",
    "&.Mui-checked": {
      transform: "translateX(14px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#328714",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 14,
    height: 14,
    color: "#FFFFFF",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 300,
    }),
  },
}));

const BinaryVersionsFormField = ({ formik, isEditing, isViewMode = false }: FieldProps) => {
  const commonSelectProps = <K extends keyof FormValues>(name: K) => ({
    name: name as string,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.errors[name] as string | undefined,
    touched: !!formik.touched[name],
    disabled: isViewMode,
    inputStyles: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "36px !important",
        "&.Mui-focused fieldset": { borderColor: "#2961F4 !important" },
        "&.Mui-disabled": { backgroundColor: "#f5f5f5" },
      },
      "& .MuiSelect-select": { padding: "16px 14px" },
    },
    selectMenuStyles: {
      "& .MuiPaper-root": {
        borderRadius: "36px",
        marginTop: "4px",
        "& .MuiMenuItem-root": {
          "&.Mui-selected": { backgroundColor: "#2961F4", color: "#FFF" },
        },
      },
    },
  });

  const datePickerProps = {
    name: "releaseDate",
    label: "Release Date",
    value: formik?.values?.releaseDate as Date | null,
    onChange: (value: Date | null) => formik.setFieldValue("releaseDate", value),
    onBlur: formik.handleBlur,
    error: formik.errors.releaseDate as string | undefined,
    touched: !!formik.touched.releaseDate,
    disabled: isViewMode,
    inputStyles: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "36px !important",
        "&.Mui-focused fieldset": { borderColor: "#2961F4 !important" },
        "&.Mui-disabled": { backgroundColor: "#f5f5f5" },
      },
    },
    showToday: false, // Disable automatic today date setting to prevent infinite loops
  };

  const handleAddOsEntry = () => {
    if (formik.values.osCompatibility && formik.values.osVersion) {
      const newEntry = {
        os: formik.values.osCompatibility,
        version: formik.values.osVersion,
      };
      formik.setFieldValue("osEntries", [...formik.values.osEntries, newEntry]);
      formik.setFieldValue("osCompatibility", "");
      formik.setFieldValue("osVersion", "");
      formik.setTouched({
        ...formik.touched,
        osCompatibility: false,
        osVersion: false,
      });
    }
  };

  const handleDeleteOsEntry = (indexToDelete: number) => {
    const updatedEntries = formik.values.osEntries.filter((_, index) => index !== indexToDelete);
    formik.setFieldValue("osEntries", updatedEntries);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      
      <BinaryTextField
        name="version"
        label="Agent Version"
        value={formik.values.version}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.version}
        touched={!!formik.touched.version}
        placeholder="Enter Version Number"
        disabled={isViewMode || isEditing}
      />

      
      <Box sx={{ backgroundColor: "#f7f7fa", marginTop: "-25px", padding: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, fontFamily: "Johnson Text" }}>
            Compatible OS Details
          </Typography>
          <Button
            onClick={handleAddOsEntry}
            disabled={!formik.values.osCompatibility || !formik.values.osVersion || isViewMode}
            sx={{
              mb: 0.5,
              color: "#2961F4",
              borderRadius: "36px",
              "&:hover": {
                backgroundColor: "#FFFFFF",
              },
              "&:disabled": {
                color: "#ccc",
              },
            }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            <BinarySelectField
              label="Compatible OS"
              options={["Windows", "Linux"]}
              name="osCompatibility"
              value={formik.values.osCompatibility}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.osCompatibility}
              touched={!!formik.touched.osCompatibility}
              disabled={isViewMode}
              inputStyles={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "36px !important",
                  "&.Mui-focused fieldset": {
                    borderColor: "#2961F4 !important",
                    borderWidth: "1px !important",
                  },
                  "&.Mui-disabled": { backgroundColor: "#f5f5f5" },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <BinaryTextField
              name="osVersion"
              label="Enter OS Version"
              value={formik.values.osVersion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.osVersion}
              touched={!!formik.touched.osVersion}
              placeholder="Enter OS Version"
              disabled={isViewMode}
              inputStyles={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "36px !important",
                  "&.Mui-focused fieldset": {
                    borderColor: "#2961F4 !important",
                    borderWidth: "1px !important",
                  },
                },
              }}
            />
          </Box>
        </Box>

        {formik.values.osEntries?.length > 0 && (
          <Box>
            {formik.values.osEntries.map((entry, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 1,
                  backgroundColor: "#F9F9F9",
                  borderRadius: "36px",
                  position: "relative",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Typography variant="body2">
                      <Box component="span" sx={{ fontWeight: 500, fontFamily: "Johnson Text" }}>
                        Compatible OS:
                      </Box>{" "}
                      {entry.os}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">
                      <Box component="span" sx={{ fontWeight: 500, fontFamily: "Johnson Text" }}>
                        OS Version:
                      </Box>{" "}
                      {entry.version}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <IconButton
                      onClick={() => handleDeleteOsEntry(index)}
                      size="small"
                      disabled={isViewMode}
                      sx={{
                        color: "#1C274C",
                        marginTop: "-5px",
                        "&:hover": {
                          backgroundColor: "#f7f9fb",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      
      {!isEditing && <BinarySelectField label="Version Status" options={["Current", "Previous", "Beta"]} {...commonSelectProps("status")} />}

      
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          marginTop: isEditing ? "0px" : "-16px",
        }}
      >
        <FormControlLabel
          control={
            <CustomSwitch
              checked={formik.values.isMandatory}
              onChange={e => {
                const isChecked = e.target.checked;
                formik.setFieldValue("isMandatory", isChecked);
                formik.setFieldValue("upgradeType", isChecked ? "Mandatory" : "Optional");
              }}
              disabled={isViewMode}
            />
          }
          label="Upgrade Type is Mandatory?"
          sx={{
            margin: 0,
            "& .MuiFormControlLabel-label": {
              ml: 1,
              fontSize: "0.875rem",
              color: "text.primary",
            },
          }}
        />
      </Box>

      
      {!isEditing && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <BinaryDatePickerField {...datePickerProps} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <BinaryTextField
              name="rustcversion"
              label="Rustcversion"
              value={formik.values.rustcversion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.rustcversion}
              touched={!!formik.touched.rustcversion}
              placeholder="Enter Rustcversion"
              disabled={isViewMode}
            />
          </Box>
        </Box>
      )}

      
      {!isEditing && (
        <BinaryTextField
          name="s3Url"
          label="Version Download URL"
          value={formik.values.s3Url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.s3Url}
          touched={!!formik.touched.s3Url}
          placeholder="Enter URL"
          disabled={isViewMode}
        />
      )}
    </Box>
  );
};

export default BinaryVersionsFormField;
