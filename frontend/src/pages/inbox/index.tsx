import { FormGroup, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { getTasks } from "../../store/thunks/tasks";
import { useStyles } from "./styles";
import {EditCalendar} from '@mui/icons-material';
import TopBarComponent from "../../components/top-bar";
import TaskEditorDialogNew from "../../components/task-editor";

const InboxComponent = () => {
  const [filter, setFilter] = useState('')

  const dispatch = useAppDispatch()
  const classes = useStyles()

  useEffect(() => {
    dispatch(getTasks(sessionStorage.getItem('token')))
  }, [])

  const all_tasks = useAppSelector(state => state.tasks.all_tasks)
  

  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const handleOpen = (elementId: string) => {
    setOpenDialogs(prev => ({ ...prev, [elementId]: true }));
  };

  const handleClose = (elementId: string) => {
    setOpenDialogs(prev => ({ ...prev, [elementId]: false }));
  };
  

  const renderInbox = (tasks: any) => {
    return tasks.map((element: any, index: any) => 
        (element.title.includes(filter) || element.description.value.includes(filter)) ? (
        <ListItem key={element.id}>
            <ListItemButton 
            className={classes.navItem}
            onClick={() => handleOpen(element.id)}>
                <ListItemIcon>
                  <EditCalendar />
                </ListItemIcon>
                <ListItemText>
                    <Typography variant={"body1"}>{element.title}</Typography>
                </ListItemText>
            </ListItemButton>
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
      <TopBarComponent title={"Входящие"} setFilter={setFilter}/>
      <FormGroup>
        {renderInbox(all_tasks)}
      </FormGroup>
    </div>
  )
};

export default InboxComponent;
