import { Box, Grid } from "@mui/material"
import React from "react"

const TopBarComponent = () => {
  return (
    <Box display='flex' justifyContent='space-between' px={"32px"} py={"24px"}>
        <Grid>
            Welcome!
        </Grid>

    </Box>
  )
};

export default TopBarComponent;
