import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/material";
import BinaryVersionsModalLayout from "./BinaryVersionsModalLayout";
import BinaryFormButtons from "./BinaryFormButtons";
import BinaryVersionsFormField from "./BinaryVersionsFormField";

type BinaryVersion = {
  _id: any;
  id?: string;
  version: string;
  osCompatibility: string | string[];
  osVersion: string;
  osEntries: { os: string; version: string }[];
  status: string;
  upgradeType: string;
  s3Url: string;
  releaseDate: string;
  isMandatory: boolean;
  rustcversion: string;
};

type BinaryVersionsModalProps = {
  open: boolean;
  onClose: () => void;
  handleAddBinaryVersion: (version: Omit<BinaryVersion, "id">) => void;
  handleUpdateBinaryVersion: (version: Omit<BinaryVersion, "id">) => void;
  editingVersion: BinaryVersion | null;
  isViewMode?: boolean;
};

const BinaryVersionsModal = ({ open, onClose, handleAddBinaryVersion, handleUpdateBinaryVersion, editingVersion, isViewMode = false }: BinaryVersionsModalProps) => {
    // State to store original values for change detection
  const [originalValues, setOriginalValues] = useState<{
    osEntries: { os: string; version: string }[];
    upgradeType: string;
  } | null>(null);

  // Create validation schema based on whether we're editing or creating
  // useMemo ensures the schema recalculates when editingVersion changes
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        version: Yup.string().required("Version is required"),
        // Only require osEntries when creating (not editing)
        osEntries: editingVersion ? Yup.array() : Yup.array().min(1, "At least one OS entry is required"),
        status: Yup.string(),
        upgradeType: Yup.string().required("Upgrade type is required"),
        s3Url: Yup.string(),
        releaseDate: Yup.date()
          .nullable()
          .transform((value, originalValue) => {
            // Handle invalid dates by converting to null
            return originalValue && !isNaN(Date.parse(originalValue)) ? value : null;
          }),
        rustcversion: Yup.string(),
      }),
    [editingVersion],
  );

  const formik = useFormik<{
    _id: any;
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
  }>({
    enableReinitialize: false, // DISABLE to prevent infinite loops
    initialValues: {
      _id:"",
      version: "",
      osCompatibility: "",
      osVersion: "",
      osEntries: [],
      status: "Current",
      upgradeType: "Optional",
      isMandatory: false,
      s3Url: "",
      releaseDate: null,
      rustcversion: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        // Prepare the payload
        const payload: any = {
          id:values._id,
          version: values.version,
          osCompatibility: values.osEntries.length > 0 ? values.osEntries[0].os : "",
          osVersion: values.osEntries.length > 0 ? values.osEntries[0].version : "",
          osEntries: values.osEntries,
          upgradeType: values.upgradeType, // Use the upgradeType field directly
          isMandatory: values.isMandatory,
        };

        // Only include these fields when creating (not editing)
        if (!editingVersion) {
          payload.status = values.status;
          payload.s3Url = values.s3Url;
          payload.releaseDate = values.releaseDate ? values.releaseDate.toISOString().split("T")[0] : "";
          payload.rustcversion = values.rustcversion;
        }

        if (editingVersion) {
          await handleUpdateBinaryVersion(payload);
        } else {
          await handleAddBinaryVersion(payload);
        }

        // Reset form and close modal only after successful submission
        formik.resetForm();
        onClose();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Form submission error:", error);
        // Don't close modal on error - let user see the error message
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (open && editingVersion) {
      // Parse release date safely
      let parsedDate = null;
      if (editingVersion.releaseDate) {
        const tempDate = new Date(editingVersion.releaseDate);
        // Only set if it's a valid date
        parsedDate = !isNaN(tempDate.getTime()) ? tempDate : null;
      }

      // Store original values for change detection
      setOriginalValues({
        osEntries: editingVersion.osEntries || [],
        upgradeType: editingVersion.upgradeType,
      });

      // Manually set values when editing
      formik.setValues({
        _id:editingVersion.id,
        version: editingVersion.version,
        osCompatibility: "",
        osVersion: "",
        osEntries: editingVersion.osEntries || [],
        status: editingVersion.status,
        upgradeType: editingVersion.upgradeType,
        isMandatory: editingVersion.upgradeType === "Mandatory" || editingVersion.isMandatory || false,
        s3Url: editingVersion.s3Url,
        releaseDate: parsedDate,
        rustcversion: editingVersion.rustcversion || "",
      });
    } else if (open && !editingVersion) {
      // Reset form for new entry
      formik.resetForm();
      setOriginalValues(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingVersion?.id]); // Only depend on stable values - open state and editingVersion ID

  // Compute whether form has changes (for edit mode only)
const hasChanges = useMemo(() => {
    if (!editingVersion || !originalValues) return true; // Always allow submit in add mode
    
    // Check OS entries changes (deep comparison)
    const osEntriesChanged = 
      formik.values.osEntries.length !== originalValues.osEntries.length ||
      !formik.values.osEntries.every((entry, index) => 
        entry.os === originalValues.osEntries[index]?.os &&
        entry.version === originalValues.osEntries[index]?.version
      );
    
    // Check upgrade type changes
    const upgradeTypeChanged = formik.values.upgradeType !== originalValues.upgradeType;
    
    const changed = osEntriesChanged || upgradeTypeChanged;
    
    return changed;
  }, [formik.values.osEntries, formik.values.upgradeType, originalValues, editingVersion]);

  const handleClose = (_: unknown, reason?: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick") {
      formik.resetForm();
      onClose();
    }
  };

  const getModalTitle = () => {
    if (isViewMode) return "View Binary Details";
    if (editingVersion) return "Edit Binary";
    return "Add Binary";
  };
  return (
    <BinaryVersionsModalLayout open={open} onClose={handleClose} title={getModalTitle()}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <BinaryVersionsFormField formik={formik} isEditing={!!editingVersion} isViewMode={isViewMode} />
        <BinaryFormButtons
          onCancel={() => {
            formik.resetForm();
            setOriginalValues(null);
            onClose();
          }}
          isEditing={!!editingVersion}
          isViewMode={isViewMode}
          isSubmitting={formik.isSubmitting}
          hasChanges={hasChanges}
        />
      </Box>
    </BinaryVersionsModalLayout>
  );
};

export default BinaryVersionsModal;