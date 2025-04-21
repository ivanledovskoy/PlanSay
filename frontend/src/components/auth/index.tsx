import React, { JSX, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './login';
import RegisterPage from './register';
import Box from '@mui/material/Box';
import './style.css'

import { Button, TextField, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { instance } from '../../utils/axios';
import { useAppDispatch } from '../../utils/hook';
import { login } from '../../store/slice/auth';
import { AppErrors } from '../../common/errors';

// const FormDialog = () => {
//     const [open, setOpen] = React.useState(false);
  
//     const handleClickOpen = () => {
//       setOpen(true);
//     };
  
//     const handleClose = () => {
//       setOpen(false);
//     };
  
//     return (
//       <div>
//         <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//           Open form dialog
//         </Button>
//         <Dialog open={false} onClose={handleClose} aria-labelledby="form-dialog-title">
//           <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               To subscribe to this website, please enter your email address here. We will send updates
//               occasionally.
//             </DialogContentText>
//             <TextField
//               autoFocus
//               margin="dense"
//               id="name"
//               label="Email Address"
//               type="email"
//               fullWidth
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleClose} color="primary">
//               Subscribe
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     );
//   }

const AuthRootComponent: React.FC  = (): JSX.Element => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    
    const [secondFactor, setSecondFactor] = useState('')
    const [open, setOpen] = useState(false)
    const [qrCode, setQrCode] = useState('')
    const location = useLocation()

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        if (location.pathname === '/login') {
            try {
                const userData = {
                    email,
                    password,
                    secondFactor
                }
                const user = await instance.post('/login/', userData)
                dispatch(login(user.data))
                navigate('/')
            } 
            catch (e) {
                return e
            }
        }
        else {
            if (password === repeatPassword) {
                try {
                    const userData = {
                        email,
                        password
                    }
                    const totpKey = await instance.post('/register', userData)
                    setQrCode(totpKey.data)
                    setOpen(true)
                }
                catch (e) {
                    return e
                }
            }
            else {
                console.log(AppErrors.PasswordDoNotMatch)
            }
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleNext = async () => {
        const userData = {
            email,
            password,
            secondFactor
        }
        const user = await instance.post('/login/', userData)
        dispatch(login(user.data))
        navigate('/')
    };
    
    return (
        <div className='root'>
            <form className='form' onSubmit={handleSubmit}>
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
                        ? <LoginPage setEmail={setEmail} setPassword={setPassword} setSecondFactor={setSecondFactor} navigate={navigate}/> : location.pathname === '/register' 
                            ? <RegisterPage setEmail={setEmail} setPassword={setPassword} setRepeatPassword={setRepeatPassword} navigate={navigate}/> : null)}
                </Box>
                <Dialog open={open} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Завершение регистрации</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Для продолжения добавьте данный QR-код в приложение двухфакторной аутентификации, например, Google Authenticator.
                        </DialogContentText>
                        <div className='aligncenter'>
                            <img autoFocus alt="2FA Code" src={`data:image/jpeg;charset=utf-8;base64,${qrCode}`}/>
                        </div>
                        <TextField fullWidth={true} margin='normal' label="2FA Code" variant="outlined" placeholder='Введите код двухфакторной аутентификации' onChange={(event) => setSecondFactor(event.target.value)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                        Отмена
                        </Button>
                        <Button onClick={handleNext} color="primary">
                        Продолжить
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    )
}

export default AuthRootComponent;
