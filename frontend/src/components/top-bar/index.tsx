import { Html, Search, StarOutline } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material"
import React from "react"
import AppLoadingButton from "../loading-button";

const TopBarComponent = (props: any) => {
  const { title, setFilter } = props;
  return (
    <div>
      <Box display='flex' width='100%' sx = {{borderBottom:`1px solid #3C3C3C`}}>
        <ListItem>
            <ListItemIcon>
              <StarOutline />
            </ListItemIcon>
            <ListItemText>
                <h1>{title}</h1>
            </ListItemText>
      
            <TextField
            onChange={(e) => setFilter(e.target.value)}
            color='info'
              InputProps={{
                startAdornment: (
                    <IconButton>
                      <Search />
                    </IconButton>
                )
              }}
            />
        </ListItem>
      </Box>
      <Box>
        <h1></h1>
      </Box>
    </div>
  )
};

export default TopBarComponent;
