import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addOpenSearchIndex,
  getOpenSearchIndexById,
} from "../../services/configurations/configService";
import GlobalModal from "./common/GlobalModal";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";

export function OpenSearchIndexModal({
  isModalOpen,
  setIsModelOpen,
  indexId,
  isEditClicked,
}) {
  const [indexName, setIndexName] = React.useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state.jobs.targets);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isEditClicked && indexId) {
      const data = state?.find((e) => e._id === indexId);
      setIndexName(data?.indexName);
    } else {
      setIndexName("");
    }
  }, [isModalOpen, indexId, isEditClicked, state]);

  const toastMsg = isEditClicked
    ? TOAST_MESSAGES.OTHERS.INDEX_UPDATED_SUCCESSFULLY
    : TOAST_MESSAGES.OTHERS.INDEX_ADDED_SUCCESSFULLY;

  const handleClose = () => {
    setIsModelOpen(false);
  };

  const handleIndex = () => {
    setLoading(true);
    const AddDataPayload = {
      indexName: indexName,
      active: true,
    };
    const EditDataPayload = {
      indexId,
      ...AddDataPayload,
    };

    const data = isEditClicked ? EditDataPayload : AddDataPayload;

    dispatch(addOpenSearchIndex(data))
      .then((response) => {
        if (response?.payload.data?.statusCode === 200) {
          toast.success(toastMsg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
          setIsModelOpen(false);
          setIndexName("");
        } else {
          toast.error(response?.payload.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_ADD_INDEX, {
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
      name: "indexName",
      label: UI_TEXTS.TABLE_TEXTS.OPENSEARCH_INDEX_NAME,
      value: indexName,
      onChange: (e) => setIndexName(e.target.value),
      placeholder: UI_TEXTS.PLACEHOLDERS.ENTER_OPENSEARCH_INDEX_NAME,
    },
  ];
  return (
    <GlobalModal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={
        isEditClicked
          ? UI_TEXTS.HEADER_TEXT.UPDATE_OPENSEARCH_INDEX
          : UI_TEXTS.HEADER_TEXT.ADD_OPENSEARCH_INDEX
      }
      fields={fields}
      onSubmit={handleIndex}
      submitText={
        loading
          ? isEditClicked
            ? UI_TEXTS.BUTTONS.UPDATING_THREE_DOTS
            : UI_TEXTS.BUTTONS.ADDING_THREE_DOTS
          : isEditClicked
          ? UI_TEXTS.BUTTONS.UPDATE
          : UI_TEXTS.BUTTONS.ADD
      }
      data-testid="opensearch-modal"
      loading={loading}
    />
  );
}
