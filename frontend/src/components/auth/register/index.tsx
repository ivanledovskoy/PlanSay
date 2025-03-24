import React from 'react';
import { TextField, Button, Typography } from '@mui/material';

const RegisterPage = () => {
  return (
    <>
      <Typography variant="h2" fontFamily='Popins' textAlign='center'>Регистрация</Typography>
      <Typography variant="body1" fontFamily='Popins' textAlign='center'>Введите данные для регистраци</Typography>
      <TextField fullWidth={true} margin='normal' label="Имя пользователя" variant="outlined" placeholder='Введите имя пользователя'/>
      <TextField fullWidth={true} margin='normal' label="Email" variant="outlined" placeholder='Введите email'/>
      <TextField type='password' fullWidth={true} margin='normal' label="Пароль" variant="outlined" placeholder='Введите пароль'/>
      <TextField type='password' fullWidth={true} margin='normal' label="Повторите пароль" variant="outlined" placeholder='Повторите пароль'/>
      <Button sx={{fontFamily:'Popins', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Регистрация</Button>
      <Typography variant="body1" sx={{fontFamily:'Popins'}}>Уже есть аккаунт на PlanSay?<span className='incitingText'>Авторизация</span></Typography>
    </>
  );
}

export default RegisterPage;
