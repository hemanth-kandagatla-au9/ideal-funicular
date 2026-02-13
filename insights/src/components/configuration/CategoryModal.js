import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryById,
  addCategory,
} from "../../services/configurations/configService";
import GlobalModal from "./common/GlobalModal";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";

export function CategoryModal({
  isModalOpen,
  setIsModelOpen,
  categoryId,
  isEditClicked,
  onSuccess,
}) {
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryNameError, setCategoryNameError] = React.useState("");
  const state = useSelector((state) => state.jobs.categories);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isEditClicked && categoryId) {
      const data = state?.find((e) => e._id === categoryId);
      setCategoryName(data?.categoryName || "");
    } else {
      setCategoryName("");
    }
    setCategoryNameError("");
  }, [isModalOpen, categoryId, isEditClicked, state]);

  const handleInputChange = (value) => {
    const normalizedValue = value; // Don't trim here — preserve user input
    let error = "";
    if (normalizedValue && /[^a-zA-Z0-9\s]/.test(normalizedValue)) {
      error = "Only alphanumeric characters and spaces are allowed";
    } else if (normalizedValue.length > 100) {
      error = "Category name must be between 5 and 100 characters";
    } else {
      error = "";
    }

    setCategoryName(value);
    setCategoryNameError(error);
  };

  const handleInputBlur = (value) => {
    const normalizedValue = value.trim();

    let error = "";

    if (!normalizedValue) {
      error = "Category name is required";
    } else if (normalizedValue.length < 5 || normalizedValue.length > 100) {
      error = "Category name must be between 5 and 100 characters";
    } else if (
      state?.some(
        (category) =>
          category.categoryName?.toString().trim().toLowerCase() ===
            normalizedValue.toLowerCase() &&
          (!categoryId || category._id !== categoryId)
      )
    ) {
      error = "Category name already exists";
    }

    setCategoryNameError(error);
    setCategoryName(normalizedValue);
  };

  const handleClose = () => {
    if (!loading) {
      setIsModelOpen(false);
      setCategoryName("");
      setCategoryNameError("");
    }
  };

  const handleCategory = () => {
    const trimmedName = categoryName.trim();
    handleInputBlur(trimmedName);
    if (trimmedName && /[^a-zA-Z0-9\s]/.test(trimmedName)) {
      setCategoryNameError(
        "Only alphanumeric characters and spaces are allowed"
      );
    }

    if (categoryNameError) {
      toast.error(categoryNameError, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (!trimmedName) {
      toast.error("Category name is required", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }
    setLoading(true);
    const AddDataPayload = {
      categoryName: trimmedName,
      active: true,
    };
    const EditDataPayload = {
      categoryId,
      ...AddDataPayload,
    };

    const data = isEditClicked ? EditDataPayload : AddDataPayload;

    dispatch(addCategory(data))
      .then((response) => {
        if (response?.payload?.data?.statusCode === 200) {
          toast.success(
            response?.payload?.data?.message === "API executed successfully"
              ? isEditClicked
                ? TOAST_MESSAGES.OTHERS.CATEGORY_UPDATED_SUCCESSFULLY
                : TOAST_MESSAGES.OTHERS.CATEGORY_ADDED_SUCCESSFULLY
              : response?.payload?.data?.message,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );
          onSuccess && onSuccess();
          setIsModelOpen(false);
          setCategoryName("");
          setCategoryNameError("");
        } else {
          toast.error(response?.payload?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_ADD_CATEGORY, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fields = [
    {
      name: "categoryName",
      label: "Category Name",
      value: categoryName || "",
      onChange: (e) => handleInputChange(e.target.value),
      onBlur: (e) => handleInputBlur(e.target.value),
      placeholder: UI_TEXTS.PLACEHOLDERS.ENTER_CATEGORY_NAME,
      error: !!categoryNameError,
      errorText: categoryNameError,
      // helperText: !categoryNameError && `${categoryName.trim().length}/200 characters`,
      maxLength: 100,
    },
  ];

  const isCategoryNameValid = () => {
    const trimmedName = categoryName.trim();
    const hasValidLength = trimmedName.length >= 5 && trimmedName.length <= 100;
    const hasValidCharacters = !/[^a-zA-Z0-9\s]/.test(trimmedName);
    const isNotEmpty = trimmedName.length > 0;

    return (
      hasValidLength && hasValidCharacters && isNotEmpty && !categoryNameError
    );
  };

  return (
    <GlobalModal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={isEditClicked ? "Update Category" : "Add Category"}
      fields={fields}
      onSubmit={handleCategory}
      // submitText={isEditClicked ? "Update" : "Add"}
      submitText={
        loading
          ? isEditClicked
            ? "Updating..."
            : "Adding..."
          : isEditClicked
          ? "Update"
          : "Add"
      }
      submitDisabled={!isCategoryNameValid() || loading}
      data-testid="category-modal-test"
      loading={loading}
    />
  );
}
