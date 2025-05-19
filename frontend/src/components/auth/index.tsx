import React, { JSX, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import LoginPage from './login';
import RegisterPage from './register';
import Box from '@mui/material/Box';
import './style.css'

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

import { Button, TextField, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Alert } from '@mui/material';
import { useAppDispatch } from '../../utils/hook';
import { AppErrors } from '../../common/errors';
import { AxiosError } from 'axios';
import { loginUser, registerUser } from '../../store/thunks/auth';

// const URL = "https://i.imgur.com/L95wKD3.png"
const URL = "https://i.imgur.com/F0UhuxJ.jpeg"

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
            const resp = await dispatch(loginUser(data))
            if (resp.type === "/login/rejected") {
                setNotification(resp.payload)
            }
            else {
                if (sessionStorage.getItem('password_reset_required') == "true") {
                    navigate('/account')
                }
                else {
                    navigate('/inbox')
                }
            }
        }
        else {
            if (data.password === data.repeatPassword) {
                const resp : any = await dispatch(registerUser(data))
                if (resp.type === "/register/rejected") {
                    setNotification(resp.payload)
                }
                else {
                    setQrCode(resp.payload)
                    setOpen2fa(true)
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
        const resp = await dispatch(loginUser(data))
        if (resp.type === "/login/rejected") {
            setNotification(resp.payload)
        }
        else {
            navigate('/')
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
        <div className="background" style={{ backgroundImage: `url(${URL})` }}>
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
                    >
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
