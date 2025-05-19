import React, { useState } from "react"
import TopBarComponent from "../../components/top-bar";
import { Alert, Box, Snackbar, SnackbarCloseReason, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import AppLoadingButton, { BigRedButton } from "../../components/loading-button";
import { useAppDispatch } from "../../utils/hook";
import { deactivateSessions } from "../../store/thunks/tasks";
import { AppErrors } from "../../common/errors";
import { instance } from "../../utils/axios";

const AccountComponent = () => {
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState('');

    const dispatch = useAppDispatch()

    const {
        register,
        formState: {
            errors
        }, handleSubmit
    } = useForm()

    const handleCloseNoti = (
      event: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setNotification('');
    };

    const changePassword = async (data: any) => {
      try {
          await instance.post( `/password-change`, data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
          sessionStorage.removeItem('password_reset_required')
      } catch (error) {
        console.log(error)
      }
    }

    const handleSubmitForm = async (data: any) => {
        console.log(data)
        if (data.password === data.repeatPassword) {
            await changePassword({"password": data.password})
        }
        else {
            setNotification(AppErrors.PasswordDoNotMatch)
        }
    }

    return (
        <div>
          <TopBarComponent title={"Аккаунт"} setFilter={setFilter}/>
          <form className='form' onSubmit={handleSubmit(handleSubmitForm)}>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    flexDirection='column'
                    maxWidth={640}
                    padding={5}
                    >
                        <>
      <Typography variant="h3" fontFamily='Poppins' textAlign='center'>Смена пароля</Typography>
      <Typography variant="body1" fontFamily='Poppins' textAlign='center'>Введите новый пароль</Typography>
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
      <AppLoadingButton loading={false} type="submit" sx={{ marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Сменить пароль</AppLoadingButton>
      <h1></h1>
      <BigRedButton onClick={() => dispatch(deactivateSessions(sessionStorage.getItem('token')))} loading={false} sx={{ marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Деактировать активные сессии</BigRedButton>
    </>
                </Box>
                <Snackbar open={!!notification} autoHideDuration={6000} onClose={handleCloseNoti}>
                    <Alert
                    onClose={handleCloseNoti}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100'}}
                    >
                    {`${notification}`}
                    </Alert>
                </Snackbar>
            </form>
          {/* <FormGroup>
            {renderInbox(all_tasks)}
          </FormGroup> */}
        </div>
      )
};

export default AccountComponent;
