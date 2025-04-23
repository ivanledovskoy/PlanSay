import React, { useEffect, useState } from "react"
import {
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Drawer, 
    Grid, 
    IconButton, 
    InputAdornment, 
    InputBase, 
    List, 
    ListItem, 
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
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
import { instance } from "../../utils/axios";
import { getSecondsInDay } from "@mui/x-date-pickers/internals/utils/time-utils";
import { Delete, Search } from "@mui/icons-material";

export const TaskEditorDialogNew = (props: any) => {
    const { open, onClose, taskTitle, taskDescription, taskId} = props;

    let newDate = ''

    const dispatch = useAppDispatch()
    
    const changeDate = (value: any) =>  {
      newDate = value.toISOString()
    }

    const {
      register,
      formState: {
          errors
      }, handleSubmit
  } = useForm()
    
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

    const removeTask = async () => {
      try {
        if (taskId) {
          await instance.delete( `/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
      onClose()
    }

    const handleSubmitForm = async (data: any) => {
      try {
        if (newDate) {
          data["remember_data"] = newDate
        }

        if (taskId) {
          await instance.put( `/tasks/${taskId}`, data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
        }
        else {
          await instance.post( '/tasks', data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
      onClose()
    }

    return (
         <Dialog
         fullWidth={true}
         open={open}
         onClose={onClose}
         >
      <form className='form' onSubmit={handleSubmit(handleSubmitForm)}>
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
          defaultValue={taskTitle}
          type='text'
          variant="standard"
          slotProps={{
              input: {
                  disableUnderline: true,
              },
          }}
          error={!!errors.title}
          helperText={errors.title ? `${errors.title.message}` : ''}
          {...register('title', {
            required: 'Это обязательное поле'
          })}
          sx = {{marginBottom: 3}}
        />

        <TextField
        placeholder='Описание задачи' 
        defaultValue={taskDescription}
        type='text'
        multiline={true}
        variant="standard"
        slotProps={{
            input: {
                disableUnderline: true,
            },
        }}
        error={!!errors.description}
        helperText={errors.description ? `${errors.description.message}` : ''}
        {...register('description')}
        sx = {{marginBottom: 3}}
        />
      <DateTimePickerViewRenderers />
      
      <AppLoadingButton loading={false} type="submit" sx={{ margin: 'auto', marginTop: 5, width: '60%'}} variant="contained">Сохранить</AppLoadingButton>
      <Stack direction="row" spacing={1} justifyContent={'flex-end'}>
        <IconButton onClick={removeTask} aria-label="delete">
          <Delete color="error"/>
        </IconButton>
      </Stack>
    </>
      </Box>
  </form>
       </Dialog>
    )

};

export default TaskEditorDialogNew;
