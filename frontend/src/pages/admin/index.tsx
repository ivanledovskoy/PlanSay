import { Checkbox, FormGroup, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { getInbox, getToday, getUsersList } from "../../store/thunks/tasks";
import { useStyles } from "./styles";
import {AccountBox, Delete, EditCalendar} from '@mui/icons-material';
import TopBarComponent from "../../components/top-bar";
import { instance } from "../../utils/axios";
import UserEditor from "../../components/user-editor";

const AdminComponent = () => {
  const [filter, setFilter] = useState('')

  const dispatch = useAppDispatch()
  const classes = useStyles()

  // useEffect(() => {
  //   dispatch(getInbox(sessionStorage.getItem('token')))
  // }, [])

  useEffect(() => {
    dispatch(getUsersList(sessionStorage.getItem('token')))
  }, [])

  const all_tasks = useAppSelector(state => state.tasks.all_tasks)
  console.log(all_tasks)
  

  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const handleOpen = (elementId: string) => {
    setOpenDialogs(prev => ({ ...prev, [elementId]: true }));
  };

  const handleClose = (elementId: string) => {
    setOpenDialogs(prev => ({ ...prev, [elementId]: false }));
    //dispatch(getInbox(sessionStorage.getItem('token')))
  };
  
  const removeTask = async (taskId: any) => {
    try {
      if (taskId) {
        await instance.delete( `/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
      }
    } catch (error) {
      sessionStorage.clear()
      console.log(error)
    }
    //dispatch(getInbox(sessionStorage.getItem('token')))
  }

  const renderAdmin = (tasks: any) => {
    return tasks.map((element: any, index: any) => 
        <ListItem key={element.id}>
            <ListItemButton 
            className={classes.navItem}
            onClick={() => handleOpen(index)}>
                <ListItemIcon>
                  <AccountBox />
                </ListItemIcon>
                <ListItemText>
                    <Typography variant={"h2"}>{element.email} {element.role != 'user' ? '(Админ)' : null }</Typography>
                </ListItemText>
            </ListItemButton>
            <Checkbox onClick={() => removeTask(element.id)} icon={<Delete color="error"/>} checkedIcon={<Delete color="error"/>}/>
            <UserEditor
              open={openDialogs[index] || false}
              onClose={() => handleClose(index)}
              email={element.email}
              role={element.role}
              userId={element.user_id}
              active={element.active}
            />
        </ListItem>
    )
  }

  return (
    <div>
      <TopBarComponent title={"Админ-панель"} setFilter={setFilter}/>
      <FormGroup>
        {renderAdmin(all_tasks)}
      </FormGroup>
    </div>
  )
};

export default AdminComponent;
