import { StarOutline } from "@mui/icons-material";
import { Box, Grid, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import React from "react"

const TopBarComponent = (props: any) => {
  const { title } = props;
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
        </ListItem>
      </Box>
      <Box>
        <h1></h1>
      </Box>
    </div>
  )
};

export default TopBarComponent;
