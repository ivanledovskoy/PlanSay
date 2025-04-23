import { StarOutline } from "@mui/icons-material";
import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react"
import { useNavigate } from "react-router-dom";

const LogoutComponent = () => {
    const navigate = useNavigate()

    sessionStorage.clear()
    return (
        <div>
        <Box display='flex' width='100%' sx = {{borderBottom:`1px solid #3C3C3C`}}>
          <ListItem>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText>
                  <h1>Вы успешно вышли из аккаунта!</h1>
              </ListItemText>
          </ListItem>
        </Box>
        <Box>
          <h1></h1>
        </Box>
      </div>
    )
};

export default LogoutComponent;
