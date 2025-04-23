import { Checkbox, checkboxClasses, FormGroup, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { getInbox, getToday } from "../../store/thunks/tasks";
import { useStyles } from "./styles";
import {Delete, EditCalendar, Favorite, FavoriteBorder} from '@mui/icons-material';
import TopBarComponent from "../../components/top-bar";
import TaskEditorDialogNew from "../../components/task-editor";
import dayjs, { Dayjs } from 'dayjs';
import { instance } from "../../utils/axios";

const InboxComponent = () => {
  const [filter, setFilter] = useState('')

  const dispatch = useAppDispatch()
  const classes = useStyles()

  useEffect(() => {
    dispatch(getToday(sessionStorage.getItem('token')))
  }, [])

  const all_tasks = useAppSelector(state => state.tasks.all_tasks)
  

  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const handleOpen = (elementId: string) => {
    setOpenDialogs(prev => ({ ...prev, [elementId]: true }));
  };

  const handleClose = (elementId: string) => {
    setOpenDialogs(prev => ({ ...prev, [elementId]: false }));
    dispatch(getToday(sessionStorage.getItem('token')))
  };

  const removeTask = async (taskId: any) => {
    try {
      if (taskId) {
        await instance.delete( `/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
      }
    } catch (error) {
      console.log(error)
    }
    dispatch(getToday(sessionStorage.getItem('token')))
  }

    const updateTask = async (taskId: any, data: any) => {
      console.log(taskId, data)
      try {
        if (taskId) {
          await instance.put( `/tasks/${taskId}`, data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
    }

  const handleCheckbox = async (value: boolean, elementId: number) => {
    await updateTask(elementId, {"is_completed": value})
    dispatch(getToday(sessionStorage.getItem('token')))
  }
  
  const renderToday = (tasks: any) => {
    return tasks.map((element: any, index: any) => 
        (element.title.includes(filter) || element.description.value.includes(filter)) ? (
        <ListItem key={element.id}>
            <Checkbox 
              checked={element.is_completed}   
              sx={{
                [`&, &.${checkboxClasses.checked}`]: {
                  color: '#1E90FF',
                },
              }} 
              onClick={(event: any) => handleCheckbox(!element.is_completed, element.id)}
              />
            <ListItemButton 
            className={classes.navItem}
            onClick={() => handleOpen(element.id)}>
                <ListItemText>
                    <Typography variant={"h2"}>{element.title}</Typography>
                    <Typography variant={"body2"}>{`${dayjs(element.remember_data).add(6, 'hours')}`}</Typography>
                </ListItemText>
            </ListItemButton>
            <Checkbox onClick={() => removeTask(element.id)} icon={<Delete color="error"/>} checkedIcon={<Delete color="error"/>}/>
            <TaskEditorDialogNew
              open={openDialogs[element.id] || false}
              onClose={() => handleClose(element.id)}
              taskTitle={element.title}
              taskDescription={element.description.value}
              taskId={element.id}
            />
        </ListItem>
        ) : null
    )
  }

  return (
    <div>
      <TopBarComponent title={"Сегодня"} setFilter={setFilter}/>
      <FormGroup>
        {renderToday(all_tasks)}
      </FormGroup>
    </div>
  )
};

export default InboxComponent;
