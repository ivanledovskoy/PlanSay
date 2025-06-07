import { StarOutline } from "@mui/icons-material";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material";
import React, { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";

const TelegramComponent = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        navigate("/inbox")
    };

    return (
    <Dialog 
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Отправьте данный токен боту @PlanSay_Bot
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <TextField 
          fullWidth 
          margin='normal' 
          label="Token" 
          variant="outlined" 
          value={localStorage.getItem('token')}
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>
    </Dialog>
    )
};

export default TelegramComponent;
