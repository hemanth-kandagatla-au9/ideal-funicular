import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { addHosts, getHostById } from "../../services/configurations/configService";
import GlobalModal from "./common/GlobalModal";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";

export function HostsModal({ isModalOpen, setIsModelOpen, hostId, isEditClicked }) {
  const [hostname, setHostname] = React.useState("");
  const [port, setPort] = React.useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state.jobs.hosts);

  const handlePortChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPort(value);
    }
  };

  React.useEffect(() => {
    if (isEditClicked && hostId) {
      const data = state?.find(e => e._id === hostId);
      setHostname(data?.hostname);
      setPort(data?.port);
    } else {
      setHostname("");
      setPort("");
    }
  }, [isModalOpen, hostId, isEditClicked, state]);

  const toastMsg = isEditClicked
    ? TOAST_MESSAGES.OTHERS.HOST_UPDATED_SUCCESSFULLY
    : TOAST_MESSAGES.OTHERS.HOST_ADDED_SUCCESSFULLY;

  const handleClose = () => {
    setIsModelOpen(false);
  };

  const handleHost = () => {
    const AddDataPayload = {
      hostname: hostname,
      port: parseInt(port),
    };
    const EditDataPayload = {
      hostId,
      ...AddDataPayload,
    };

    const data = isEditClicked ? EditDataPayload : AddDataPayload;

    dispatch(addHosts(data))
      .then((response) => {
        if (response?.payload.data?.statusCode === 200) {
          toast.success(toastMsg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
          setIsModelOpen(false);
          setHostname("");
          setPort("");
        } else {
          toast.error(response?.payload.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_ADD_HOST, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  const fields = [
    {
      name: "hostname",
      label: UI_TEXTS.LABELS.SERVER,
      value: hostname,
      onChange: (e) => setHostname(e.target.value),
      placeholder: "Enter Host Name",
    },
    {
      name: "port",
      label: UI_TEXTS.LABELS.PORT_NUMBER,
      value: port,
      onChange: handlePortChange,
      placeholder: "Enter Port Number",
    },
  ];

  return (
    <GlobalModal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={isEditClicked ? "Update Host" : "Add Host"}
      fields={fields}
      onSubmit={handleHost}
      submitText={isEditClicked ? "Update" : "Add"}
    />
  );
}