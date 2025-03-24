import React, { JSX } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { IPropsRegister } from '../../../common/types/auth';

const RegisterPage: React.FC<IPropsRegister> = (props: IPropsRegister): JSX.Element => {
  const {navigate, register, errors} = props

  return (
    <>
      <Typography variant="h2" fontFamily='Poppins' textAlign='center'>Регистрация</Typography>
      <Typography variant="body1" fontFamily='Poppins' textAlign='center'>Введите данные для регистраци</Typography>
      <TextField 
        error={!!errors.email}
        type="email" 
        fullWidth={true} 
        margin='normal' 
        label="Email" 
        variant="outlined" 
        placeholder='Введите email' 
        helperText={errors.email ? `${errors.email.message}` : ''}
        {...register('email', {
          required: 'Это обязательное поле'
        })}
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
          required: 'Это обязательное поле'
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
          required: 'Это обязательное поле'
        })}
        />
      <Button type='submit' sx={{fontFamily:'Poppins', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Регистрация</Button>
      <Typography variant="body1" sx={{fontFamily:'Poppins'}}>Уже есть аккаунт на PlanSay?<span className='incitingText' onClick={() => navigate('/login')}>Авторизация</span></Typography>
    </>
  );
}

export default RegisterPage;
