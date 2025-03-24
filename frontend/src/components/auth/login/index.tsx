import React, { JSX } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { IPropsLogin } from '../../../common/types/auth';

const LoginPage : React.FC<IPropsLogin> = (props: IPropsLogin) : JSX.Element => {
  const {setPassword, setEmail, setSecondFactor, navigate} = props

  return (
    <>
      <Typography variant="h2" fontFamily='Poppins' textAlign='center'>Авторизация</Typography>
      <Typography variant="body1" fontFamily='Poppins' textAlign='center'>Введите ваш логин и пароль</Typography>
      <TextField type='email' fullWidth={true} margin='normal' label="Email" variant="outlined" placeholder='Введите email' onChange={(event) => setEmail(event.target.value)}/>
      <TextField type='password' fullWidth={true} margin='normal' label="Пароль" variant="outlined" placeholder='Введите пароль' onChange={(event) => setPassword(event.target.value)}/>
      <TextField type='text' fullWidth={true} margin='normal' label="Код двухфакторной аутентификации" variant="outlined" placeholder='Введите код двухфакторной аутентификации' onChange={(event) => setSecondFactor(event.target.value)}/>
      <Button type="submit" sx={{fontFamily:'Poppins', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Войти</Button>
      <Typography variant="body1" sx={{fontFamily:'Poppins'}}>Нет аккаунта?<span className='incitingText' onClick={() => navigate('/register')}>Регистрация</span></Typography>
    </>
  );
}

export default LoginPage;
