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
import { useAppDispatch } from "../../utils/hook";
import { updateTask } from "../../store/thunks/tasks";
import { instance } from "../../utils/axios";

export const TaskEditorDialogNew = (props: IPropsTasks) => {
    const { onClose_props, open_props, selectedElement_props, setSelectedElement_props } = props;
    let newDate = ''
    
    const changeDate = (value: any) =>  {
      newDate = value.toISOString()
      console.log(newDate)
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

    
    const taskTitle = selectedElement_props ? selectedElement_props.title : ''
    const taskDescription = selectedElement_props ? selectedElement_props.description.value : ''

    const {
        register,
        formState: {
            errors
        }, handleSubmit
    } = useForm()

    const handleSubmitForm = async (data: any) => {
      try {
          if (newDate) {
            data["remember_data"] = newDate
          }
          const tasks = await instance.put( `/tasks/${selectedElement_props.id}`, data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
      } catch (error) {
        console.log(error)
      }
      onClose_props()
    }
    
    return (
         <React.Fragment>
         <Dialog
         fullWidth={true}
         open={open_props}
         onClose={onClose_props}
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
                multiline={true}
                defaultValue={taskDescription} 
                type='text'
                variant="standard"
                slotProps={{
                    input: {
                        disableUnderline: true,
                    },
                }}
                {...register('description', {})}
                sx = {{marginBottom: 5}}
                />
            <DateTimePickerViewRenderers />
      
      <AppLoadingButton loading={false} type="submit" sx={{ margin: 'auto', marginTop: 5, width: '60%'}} variant="contained">Сохранить</AppLoadingButton>
    </>
      </Box>
  </form>
       </Dialog>
   </React.Fragment>
    )

    // return (
    // <React.Fragment>
    //     <Dialog
    //     fullWidth={false}
    //     open={open_props}
    //     onClose={onClose_props}
    //     >
    //     <DialogTitle>
            // <InputBase
            // defaultValue={taskTitle}
            // placeholder="Название"
            // required={true}
            // inputProps={{ 'aria-label': 'naked' }}
            // onChange={changeTitle}
            // sx={{
            //     fontWeight: "bolder",
            // }}
            // />
    //     </DialogTitle>
    //     <DialogContent>
            // <InputBase
            // defaultValue={taskDescription}
            // placeholder="Описание"
            // inputProps={{ 'aria-label': 'naked' }}
            // multiline={true}
            // onChange={changeDescription}
            // />
            // <Box
            // noValidate
            // component="form"
            // sx={{
            //     display: 'flex',
            //     flexDirection: 'column',
            //     m: 'auto',
            //     width: 'fit-content',
            //     padding: '50px 0px 0px 0px'
            // }}
            // >
            // <DateTimePickerViewRenderers />
            // </Box>
    //     </DialogContent>
    //     <DialogActions>
    //         <Button type="submit" sx={{color: 'white'}}>Закрыть</Button>
    //     </DialogActions>
    //     </Dialog>
    // </React.Fragment>
    // );
};

export default TaskEditorDialogNew;
