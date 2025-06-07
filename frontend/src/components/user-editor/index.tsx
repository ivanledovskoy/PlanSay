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
import AppLoadingButton, { BigGreenButton, BigRedButton } from "../loading-button";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { instance } from "../../utils/axios";
import { getSecondsInDay } from "@mui/x-date-pickers/internals/utils/time-utils";
import { Delete, Search } from "@mui/icons-material";
import { getUsersList } from "../../store/thunks/tasks";

export const UserEditor = (props: any) => {
    const { open, onClose, email, role, userId, active} = props;

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

    const blockUser = async (data: any) => {
      try {
        if (userId) {
          await instance.put( `/admin/user/${userId}`, data, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
      dispatch(getUsersList(localStorage.getItem('token')))
      onClose()
    }

    const deactivateUserSession = async () => {
      try {
        if (userId) {
          await instance.delete( `/admin/deactivate-sessions/${userId}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
      dispatch(getUsersList(localStorage.getItem('token')))
      onClose()
    }

    const resetUserPassword = async (data: any) => {
      try {
        if (userId) {
          await instance.put( `/admin/user/${userId}`, data, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
      dispatch(getUsersList(localStorage.getItem('token')))
      onClose()
    }

    const handleSubmitForm = async (data: any) => {
      // try {
      //   if (newDate) {
      //     data["remember_data"] = newDate
      //   }

      //   if (taskId) {
      //     await instance.put( `/tasks/${taskId}`, data, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
      //   }
      //   else {
      //     await instance.post( '/tasks', data, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
      //   }
      // } catch (error) {
      //   console.log(error)
      // }
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
          placeholder='Email' 
          value={email}
          type='text'
          variant="standard"
          slotProps={{
              input: {
                  disableUnderline: true,
              },
          }}
          sx = {{marginBottom: 3}}
        />

        <TextField
        placeholder='Роль' 
        value={`Роль: ${role}`}
        type='text'
        multiline={true}
        variant="standard"
        slotProps={{
            input: {
                disableUnderline: true,
            },
        }}
        />

      <TextField 
        error={!!errors.password}
        type='password' 
        fullWidth={true} 
        margin='normal' 
        label="Пароль" 
        variant="outlined" 
        placeholder='Введите пароль' 
        helperText={errors.password ? `${errors.password.message}` : ''}
        {...register('password', {
          required: 'Это обязательное поле',
          minLength: 8,
          maxLength: 30
        })}
        />
      <TextField 
        error={!!errors.repeatPassword}
        type='password' 
        fullWidth={true} 
        margin='normal' 
        label="Повторите пароль" 
        variant="outlined" 
        placeholder='Повторите пароль' 
        helperText={errors.repeatPassword ? `${errors.repeatPassword.message}` : ''}
        {...register('repeatPassword', {
          required: 'Это обязательное поле',
          minLength: 8,
          maxLength: 30
        })}
        />
      
      <AppLoadingButton loading={false} type="submit" sx={{ margin: 'auto', marginTop: 5, marginBottom: 10, width: '60%'}} variant="contained">Сменить пароль</AppLoadingButton>
      {(active === true ? <BigRedButton onClick={() => blockUser({"active": !active})} loading={false} sx={{ margin: 'auto', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Заблокировать пользователя</BigRedButton>
      : <BigGreenButton onClick={() => blockUser({"active": !active})} loading={false} sx={{ margin: 'auto', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Разблокировать пользователя</BigGreenButton>)}
      <BigRedButton onClick={() => deactivateUserSession()} loading={false} sx={{ margin: 'auto', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Деактивировать сессии</BigRedButton>
      <BigRedButton onClick={() => resetUserPassword({"password_reset_required": true})} loading={false} sx={{ margin: 'auto', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Сбросить пароль</BigRedButton>
    </>
      </Box>
  </form>
       </Dialog>
    )

};

export default UserEditor;
