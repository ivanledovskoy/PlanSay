import { StarOutline } from "@mui/icons-material";
import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react"
import { Navigate, useNavigate } from "react-router-dom";

const LogoutComponent = () => {
    const navigate = useNavigate()

    localStorage.clear()
    return (
        <div>
        <Navigate to="/login" />
      </div>
    )
};

export default LogoutComponent;
