import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Scheduler from './Scheduler.component'
import { Button } from 'react-bootstrap';
import  {
    validateCronExpression
} from "../../services/jobs/JobsService";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { TOAST_MESSAGES, UI_TEXTS } from '../common/Constants/label-contants';

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "700px",
  height: "auto",
  maxHeight: "90vh", 
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
};

export function SchedulerModal({
  isModalOpen,
  setIsModelOpen,
  jobStartDate,
  setJobStartDate,
  jobEndDate,
  setJobEndDate,
  cronExp,
  setCronExp,
  viewOnly,
  showDropdown,
  setShowDropdown,
}) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(isModalOpen);
    const handleSaveClose = () => {
        dispatch(validateCronExpression(showDropdown, cronExp, jobStartDate, jobEndDate))?.then((response) => {
            if (response?.data?.statusCode !== 200) {
                toast.error(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            } else {
                setIsModelOpen(false);
                setOpen(false)
            }

        }).catch((error) => {
            toast.error(TOAST_MESSAGES.ERROR.FAILED_TO_VALIDATE_FREQUENCY_TIMING , {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        });
    };

  const handleClose = () => {
    setIsModelOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography
                style={{ display: "flex", justifyContent: "space-between" }}
                variant="h6"
                component="h2"
              >
                {UI_TEXTS.TYPOGRAPHY.SET_RECURRENCE}
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{ float: "right" }}
                >
                  <CloseIcon data-testid="scheduler-modal-close" />
                </IconButton>
              </Typography>

              <div>
                <Scheduler
                  modelOpen={open}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  cronExp={cronExp}
                  setCronExp={setCronExp}
                  viewOnly={viewOnly}
                  jobStartDate={jobStartDate}
                  setJobStartDate={setJobStartDate}
                  jobEndDate={jobEndDate}
                  setJobEndDate={setJobEndDate}
                />
              </div>
            </div>
            <Button
              onClick={handleSaveClose}
              style={{
                backgroundColor: "#104f8e",
                border: "none",
                marginTop: "12px",
                width: "100px",
                padding: "10px",
                alignSelf: "center",
              }}
            >
              {UI_TEXTS.BUTTONS.SAVE}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
