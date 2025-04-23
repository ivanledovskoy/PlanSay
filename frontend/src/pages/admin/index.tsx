import { Checkbox, FormGroup, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { getInbox, getToday, getUsers } from "../../store/thunks/tasks";
import { useStyles } from "./styles";
import {Delete, EditCalendar} from '@mui/icons-material';
import TopBarComponent from "../../components/top-bar";
import TaskEditorDialogNew from "../../components/task-editor";
import { instance } from "../../utils/axios";

const AdminComponent = () => {
  const [filter, setFilter] = useState('')

  const dispatch = useAppDispatch()
  const classes = useStyles()

  // useEffect(() => {
  //   dispatch(getInbox(sessionStorage.getItem('token')))
  // }, [])

  useEffect(() => {
    dispatch(getUsers(sessionStorage.getItem('token')))
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

  const renderInbox = (tasks: any) => {
    return tasks.map((element: any, index: any) => 
        <ListItem key={element.id}>
            <ListItemButton 
            className={classes.navItem}
            onClick={() => handleOpen(element.id)}>
                <ListItemIcon>
                  <EditCalendar />
                </ListItemIcon>
                {/* <ListItemText>
                    <Typography variant={"h2"}>{element.title}</Typography>
                </ListItemText> */}
            </ListItemButton>
            <Checkbox onClick={() => removeTask(element.id)} icon={<Delete color="error"/>} checkedIcon={<Delete color="error"/>}/>
            {/* <TaskEditorDialogNew
              open={openDialogs[element.id] || false}
              onClose={() => handleClose(element.id)}
              taskTitle={element.title}
              taskDescription={element.description.value}
              taskId={element.id}
            /> */}
        </ListItem>
    )
  }

  return (
    <div>
      <TopBarComponent title={"Админ-панель"} setFilter={setFilter}/>
      <FormGroup>
        {renderInbox(all_tasks)}
      </FormGroup>
    </div>
  )
};

export default AdminComponent;
