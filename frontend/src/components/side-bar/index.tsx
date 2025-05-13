import React, { useEffect, useState } from "react"
import { useStyles } from "./styles";
import {
    Box, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material'
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../flex-between";
import { accountMenu, adminMenu, navMenu } from "../../common/moks/navigate";
import { tokens } from "../../theme";
import { AddTask } from "@mui/icons-material";
import TaskEditorDialogNew from "../task-editor";
import { checkAdmin } from "../../utils/hook";

const SidebarComponent = (props: any) => {
  const [active, setActive] = useState('')
  const { drawerWidth, isOpen, setIsOpen } = props
  const classes = useStyles()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  useEffect(() => {
    setActive(pathname)
  }, 
  [pathname])

  const renderMenu = (menu: any) => {
    return menu.map((element: any) => 
        <ListItem key={element.id}>
            <ListItemButton 
            //className={active === element.path ? classes.active : classes.navItem} 
            className={active === element.path ? classes.active : classes.navItem} 
            //className={classes.active}
            onClick={() => navigate(`${element.path}`)}>
                <ListItemIcon>
                    {element.icon}
                </ListItemIcon>
                <ListItemText>
                    <Typography variant={"body1"}>{element.name}</Typography>
                </ListItemText>
            </ListItemButton>
        </ListItem>
    )
}

const [open, setOpen] = useState(false);

  return (
    <Box component='nav'>
        {isOpen && (
            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                variant="persistent"
                anchor="left"
                sx={{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        color: theme.palette.secondary.main,
                        backgroundColor: theme.palette.primary.main,
                        boxSizing: 'border-box',
                        width: drawerWidth
                    }
                }}
            >
                <Box width='100%' sx = {{borderBottom:`1px solid ${colors.borderColor}`}}>
                    <Box>
                        <FlexBetween>
                            <Box className={classes.brand}>
                                <Typography 
                                    variant="h1"
                                    color = {theme.palette.mode === 'dark' ? colors.white.DEFAULT : colors.black.DEFAULT}>
                                    PlanSay
                                </Typography>
                            </Box>
                        </FlexBetween>
                    </Box>
                    <List>
                        {renderMenu(navMenu)}
                    </List>
                    <List
                        sx={{marginBottom: '150px'}}
                    >
                        <ListItem>
                            <ListItemButton 
                            className={classes.navItem}
                            onClick={() => setOpen(true)}>
                                <ListItemIcon>
                                    <AddTask />
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography variant={"body1"}>Добавить задачу</Typography>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box> 
                {
                    (checkAdmin()=== true 
                        ?   <Box width='100%'>
                                <List>
                                    {renderMenu(adminMenu)}
                                </List>
                            </Box> : null)}

                <Box width='100%'>
                    <List>
                        {renderMenu(accountMenu)}
                    </List>
                </Box> 
            </Drawer>
        )}
    <TaskEditorDialogNew
        open={open}
        onClose={() => setOpen(false)}
        taskTitle={''}
        taskDescription={''}
        taskId={null}
        uploadedFiles={[]}
    />
    </Box>
  )
};

export default SidebarComponent;
