import React, { JSX, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import LoginPage from './login';
import RegisterPage from './register';
import Box from '@mui/material/Box';
import './style.css'

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

import { Button, TextField, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Alert, Typography } from '@mui/material';
import { instance } from '../../utils/axios';
import { useAppDispatch } from '../../utils/hook';
import { login } from '../../store/slice/auth';
import { AppErrors } from '../../common/errors';
import { AxiosError } from 'axios';

const AuthRootComponent: React.FC  = (): JSX.Element => {
    const [open2fa, setOpen2fa] = useState(false)
    const [qrCode, setQrCode] = useState('')
    const location = useLocation()
    const {
        register,
        formState: {
            errors
        }, handleSubmit
    } = useForm()

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSubmitForm = async (data: any) => {
        if (location.pathname === '/login') {
            try {
                const userData = {
                    email: data.email,
                    password: data.password,
                    secondFactor: data.secondFactor
                }
                const user = await instance.post('/login', userData)
                dispatch(login(user.data))
                navigate('/')
            } 
            catch (e) {
                if (e instanceof AxiosError) {
                    if (!!e.response && !!e.response.data && !!e.response?.data['detail']) { 
                        setNotification(e.response?.data['detail'])
                    }
                    else {
                        setNotification(e.response?.data["Unknown error!"])
                    }
                }
                return e
            }
        }
        else {
            if (data.password === data.repeatPassword) {
                try {
                    const userData = {
                        email: data.email,
                        password: data.password
                    }
                    const totpKey = await instance.post('/register', userData)
                    setQrCode(totpKey.data)
                    setOpen2fa(true)
                }
                catch (e) {
                    if (e instanceof AxiosError) {
                        if (!!e.response && !!e.response.data && !!e.response?.data['detail']) { 
                            setNotification(e.response?.data['detail'])
                        }
                        else {
                            setNotification(e.response?.data["Unknown error!"])
                        }
                    }
                    return e
                }
            }
            else {
                setNotification(AppErrors.PasswordDoNotMatch)
            }
        }
    }

    const handleClose = () => {
        setOpen2fa(false);
    };

    const handleNext = async (data: any) => {
        try {
            const userData = {
                email: data.email,
                password: data.password,
                secondFactor: data.secondFactorRegister
            }
            const user = await instance.post('/login/', userData)
            dispatch(login(user.data))
            navigate('/')
        }
        catch (e) {
            if (e instanceof AxiosError) {
                if (!!e.response && !!e.response.data && !!e.response?.data['detail']) { 
                    setNotification(e.response?.data['detail'])
                }
                else {
                    setNotification(e.response?.data["Unknown error!"])
                }
            }
            return e
        }
    };

    const [notification, setNotification] = useState('');
  
    const handleCloseNoti = (
      event: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setNotification('');
    };
    
    return (
        <div className='root'>
            <form className='form' onSubmit={handleSubmit(handleSubmitForm)}>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    flexDirection='column'
                    maxWidth={640}
                    margin='auto'
                    padding={5}
                    borderRadius={5}
                    boxShadow={'5px 5px 10px #ccc'}
                    sx={{ backgroundColor: "#f5f5f5"}}>
                    {
                    (location.pathname === '/login' 
                        ? <LoginPage navigate={navigate} register={register} errors={errors}/> : location.pathname === '/register' 
                            ? <RegisterPage navigate={navigate} register={register} errors={errors}/> : null)}
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
                <Dialog open={open2fa} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Завершение регистрации</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Для продолжения добавьте данный QR-код в приложение двухфакторной аутентификации, например, Google Authenticator.
                        </DialogContentText>
                        <div className='aligncenter'>
                            <img autoFocus alt="2FA Code" src={`data:image/jpeg;charset=utf-8;base64,${qrCode}`}/>
                        </div>
                        <TextField 
                            error={!!errors.secondFactorRegister}
                            fullWidth={true} 
                            margin='normal' 
                            label="2FA Code" 
                            variant="outlined" 
                            placeholder='Введите код двухфакторной аутентификации'
                            helperText={errors.secondFactorRegister ? `${errors.secondFactorRegister.message}` : ''}
                            {...register('secondFactorRegister', {
                                minLength: 6,
                                maxLength: 6
                            })}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                        Отмена
                        </Button>
                        <Button onClick={handleSubmit(handleNext)} color="primary">
                        Продолжить
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    )
}

export default AuthRootComponent;
