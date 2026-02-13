import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UI_TEXTS } from "../common/Constants/label-contants";

const SelectedServersModal = ({ open, onClose, selectedHosts }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="selected-hosts-modal"
      aria-describedby="list-of-selected-hosts"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <Typography  sx={{fontFamily:"Manrope",fontSize:"16px",color:""}}>
            {UI_TEXTS.TYPOGRAPHY.SELECTED_SERVERS}
            <Badge
              badgeContent={selectedHosts.length}
              color="primary"
              sx={{ ml: 2 }}
            />
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            overflow: "auto",
            flex: 1,
          }}
        >
          {selectedHosts.length > 0 ? (
            <List sx={{ p: 0 }}>
              {selectedHosts.map((host, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      px: 3,
                      py: 2,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                     
                    }}
                  >
                    <ListItemAvatar sx={{fontFamily:"Manrope !important",fontSize:"13px",}}>
                      <Avatar sx={{ bgcolor: "primary.main",fontSize:"13px",height:"25px",width:"25px" }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={host.hostname}  primaryTypographyProps={{
    fontFamily: "Manrope",
    fontSize: "13px",
  }}/>
                  </ListItem>
                  {index < selectedHosts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                p: 4,
              }}
            >
              <Typography color="text.secondary">
                {UI_TEXTS.TYPOGRAPHY.NO_SERVERS_SELECTED}
              </Typography>
            </Box>
          )}
        </Box>

       
      </Box>
    </Modal>
  );
};

export default SelectedServersModal;
