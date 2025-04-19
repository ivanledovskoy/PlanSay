import React, { useState } from "react"
import { ILayout } from "../../common/types/auth/layout";
// import TopBarComponent from "../top-bar";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import SidebarComponent from "../side-bar";
import { useStyles } from "./styles";

const LayoutComponent = ({children}: ILayout) => {
    const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const classes = useStyles()
  return (
    location.pathname === '/login' || location.pathname === '/register' 
        ? (
            <>
                {children}
            </>
        ) : (
            <>
                <Box>
                    <Box
                        display={'flex'} 
                        justifyContent='space-between'
                        width='100%' 
                        height='100%'>  
                        <SidebarComponent
                            drawerWidth='250px'
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                        <Box className={classes.mainSection}>
                            {children}
                        </Box>
                    </Box>
                </Box>
            </>
    )
  )
};

export default LayoutComponent;
