import React, { JSX } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { IPropsRegister } from '../../../common/types/auth';

const RegisterPage: React.FC<IPropsRegister> = (props: IPropsRegister): JSX.Element => {
  const {setEmail, setPassword, setRepeatPassword, navigate} = props

  return (
    <>
      <Typography variant="h2" fontFamily='Poppins' textAlign='center'>Регистрация</Typography>
      <Typography variant="body1" fontFamily='Poppins' textAlign='center'>Введите данные для регистраци</Typography>
      <TextField type="email" fullWidth={true} margin='normal' label="Email" variant="outlined" placeholder='Введите email' onChange={(event) => setEmail(event.target.value)}/>
      <TextField type='password' fullWidth={true} margin='normal' label="Пароль" variant="outlined" placeholder='Введите пароль' onChange={(event) => setPassword(event.target.value)}/>
      <TextField type='password' fullWidth={true} margin='normal' label="Повторите пароль" variant="outlined" placeholder='Повторите пароль' onChange={(event) => setRepeatPassword(event.target.value)}/>
      <Button type='submit' sx={{fontFamily:'Poppins', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Регистрация</Button>
      <Typography variant="body1" sx={{fontFamily:'Poppins'}}>Уже есть аккаунт на PlanSay?<span className='incitingText' onClick={() => navigate('/login')}>Авторизация</span></Typography>
    </>
  );
}

export default RegisterPage;
