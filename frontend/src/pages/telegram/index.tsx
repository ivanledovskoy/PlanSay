import { StarOutline } from "@mui/icons-material";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material";
import React from "react"
import { Navigate, useNavigate } from "react-router-dom";

const TelegramComponent = () => {
    const navigate = useNavigate()

    return (
      <Dialog open={true} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Отправьте данный токен боту @PlanSay_Bot</DialogTitle>
      <DialogContent>
          <TextField 
              fullWidth={true} 
              margin='normal' 
              label="2FA Code" 
              variant="outlined" 
              value={sessionStorage.getItem('token')}
              />
      </DialogContent>
  </Dialog>
    )
};

export default TelegramComponent;
