import { FormGroup, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { getTasks } from "../../store/thunks/tasks";
import { useStyles } from "./styles";
import {EditCalendar, Inbox, StarOutline} from '@mui/icons-material';
import TopBarComponent from "../../components/top-bar";
import TaskEditorDialogNew from "../../components/task-editor";
import { ISelectedElement } from "../../common/types/tasks";

const InboxComponent = () => {
  const dispatch = useAppDispatch()
  const classes = useStyles()

  useEffect(() => {
    dispatch(getTasks(sessionStorage.getItem('token')))
  }, [])

  const all_tasks = useAppSelector(state => state.tasks.all_tasks)
  console.log('tasks', all_tasks)

  const renderInbox = (tasks: any) => {
    return tasks.map((element: any, index: any) => 
        <ListItem key={element.id}>
            <ListItemButton 
            className={classes.navItem}
            onClick = {() => handleClickOpen(element)}>
                <ListItemIcon>
                  <EditCalendar />
                </ListItemIcon>
                <ListItemText>
                    <Typography variant={"body1"}>{element.title}</Typography>
                </ListItemText>
            </ListItemButton>
        </ListItem>
    )
}

const [open, setOpen] = React.useState(false);
const [selectedElement, setSelectedElement] = useState<any>();

const handleClickOpen = (element: any) => {
  setSelectedElement(element)
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};
  
  return (
    <div>
      <TopBarComponent title={"Входящие"}/>
      <FormGroup>
        {renderInbox(all_tasks)}
      </FormGroup>

      <TaskEditorDialogNew
        open_props={open}
        onClose_props={handleClose}
        selectedElement_props={selectedElement}
        taskTitle={selectedElement?.title || ''}
        taskDescription={selectedElement?.description?.value || ''}
      />
    </div>
  )
};

export default InboxComponent;
