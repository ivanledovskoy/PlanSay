import React, { useEffect, useState } from "react"
import {
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Drawer, 
    InputBase, 
    List, 
    ListItem, 
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
    useTheme
} from '@mui/material'
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../flex-between";
import { accountMenu, navMenu } from "../../common/moks/navigate";
import { tokens } from "../../theme";
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IPropsTasks } from "../../common/types/tasks";
import AppLoadingButton from "../loading-button";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { getTasks, updateTask } from "../../store/thunks/tasks";
import { instance } from "../../utils/axios";
import { getSecondsInDay } from "@mui/x-date-pickers/internals/utils/time-utils";

export const TaskEditorDialogNew = (props: any) => {
    const { onClose_props, open_props, selectedElement_props, taskTitle: taskTitle_props, taskDescription: taskDescription_props} = props;

    const [taskTitle, setTaskTitle] = useState(taskTitle_props);
    const [taskDescription, setTaskDescription] = useState(taskDescription_props);
    let newDate = ''

    const dispatch = useAppDispatch()
    
    const changeDate = (value: any) =>  {
      newDate = value.toISOString()
    }
    
    function DateTimePickerViewRenderers() {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
            <DateTimePicker
              label="Выберите дату и время"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              closeOnSelect={true}
              onAccept={changeDate}
            />
          </DemoContainer>
        </LocalizationProvider>
      );
    }

    const all_tasks = useAppSelector(state => state.tasks.all_tasks)

    const handleSubmitForm = async (e: any) => {
      e.preventDefault()
      try {
            const data = {
              "title": taskTitle ? taskTitle : taskTitle_props,
              "description": taskDescription ? taskDescription : taskDescription_props
            }
            if (newDate) {
              Object.assign(data, {"remember_data": newDate})
            }

          console.log(data)
          const tasks = await instance.put( `/tasks/${selectedElement_props.id}`, data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
          dispatch(getTasks(sessionStorage.getItem('token')))
      } catch (error) {
        console.log(error)
      }
      onClose_props()
    }

    return (
         <Dialog
         fullWidth={true}
         open={open_props}
         onClose={onClose_props}
         key={selectedElement_props?.id || 'new'} 
         >
      <form className='form' onSubmit={handleSubmitForm}>
      <Box
          display='flex'
          justifyContent='center'
          alignItems='left'
          flexDirection='column'
          maxWidth={640}
          margin='auto'
          padding={5} 
          >
      <>
              <TextField
                placeholder='Название задачи' 
                type='text'
                variant="standard"
                defaultValue={taskTitle_props}
                onChange={(e) => setTaskTitle(e.target.value)}
                slotProps={{
                    input: {
                        disableUnderline: true,
                    },
                }}
                sx = {{marginBottom: 3}}
                />

                <TextField
                placeholder='Описание задачи' 
                multiline={true}
                defaultValue={taskDescription_props}
                onChange={(e) => setTaskDescription(e.target.value)}
                type='text'
                variant="standard"
                slotProps={{
                    input: {
                        disableUnderline: true,
                    },
                }}
                sx = {{marginBottom: 5}}
                />
            <DateTimePickerViewRenderers />
      
      <AppLoadingButton loading={false} type="submit" sx={{ margin: 'auto', marginTop: 5, width: '60%'}} variant="contained">Сохранить</AppLoadingButton>
    </>
      </Box>
  </form>
       </Dialog>
    )

};

export default TaskEditorDialogNew;
