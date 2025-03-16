import React from 'react';
import { TextField, Button, Typography } from '@mui/material';

const LoginPage = (props: any) => {
  const {setPassword, setEmail, setSecondFactor} = props

  return (
    <>
      <Typography variant="h2" fontFamily='Popins' textAlign='center'>Авторизация</Typography>
      <Typography variant="body1" fontFamily='Popins' textAlign='center'>Введите ваш логин и пароль</Typography>
      <TextField fullWidth={true} margin='normal' label="Email" variant="outlined" placeholder='Введите email' onChange={(event) => setEmail(event.target.value)}/>
      <TextField type='password' fullWidth={true} margin='normal' label="Пароль" variant="outlined" placeholder='Введите пароль' onChange={(event) => setPassword(event.target.value)}/>
      <TextField type='text' fullWidth={true} margin='normal' label="Код двухфакторной аутентификации" variant="outlined" placeholder='Введите код двухфакторной аутентификации' onChange={(event) => setSecondFactor(event.target.value)}/>
      <Button type="submit" sx={{fontFamily:'Popins', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Войти</Button>
      <Typography variant="body1" sx={{fontFamily:'Popins'}}>Нет аккаунта?<span className='incitingText'>Регистрация</span></Typography>
    </>
  );
}

export default LoginPage;
