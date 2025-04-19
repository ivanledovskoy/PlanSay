import React, { useEffect, useState } from "react"
import { useStyles } from "./styles";
import {
    Box, 
    Drawer, 
    Divider, 
    IconButton, 
    List, 
    ListItem, 
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material'
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../flex-between";
import { navMenu } from "../../common/moks/navigate";
import {CalendarMonth, AlarmOn, HomeOutlined} from '@mui/icons-material';

const SidebarComponent = (props: any) => {
  const [active, setActive] = useState('')
  const { drawerWidth, isOpen, setIsOpen } = props
  const classes = useStyles()
  const {pathname} = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setActive(pathname.substring(1))
  }, 
  [pathname])

  const renderNavMenu = navMenu.map((element) => {
    return (
        <ListItem key={element.id}>
            <ListItemButton onClick={() => navigate(`${element.path}`)}>
                <ListItemIcon>
                    {element.icon}
                </ListItemIcon>
                <ListItemText>
                    <Typography variant={"body1"}>{element.name}</Typography>
                </ListItemText>
            </ListItemButton>
        </ListItem>
    )
  })

  return (
    <Box component='nav'>
        {isOpen && (
            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                variant="persistent"
                anchor="left"
                sx= {{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        color: "#7C7C7C",
                        backgroundColor: "#D0D0D0",
                        boxSizing: 'border-box',
                        width: drawerWidth
                    }
                }}
            >
                <Box width='100%'>
                    <Box>
                        <FlexBetween>
                            <Box display='flex' alignItems='center' gap='10px'>
                                <Typography>
                                    PlanSay
                                </Typography>
                            </Box>
                            <IconButton> 
                                <Typography>
                                    Сегодня
                                </Typography>
                            </IconButton>
                        </FlexBetween>
                    </Box>
                    <List>
                        {renderNavMenu}
                    </List>
                </Box> 
            </Drawer>
        )}
    </Box>
  )
};

export default SidebarComponent;
