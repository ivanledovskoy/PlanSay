import React, { JSX } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { IPropsLogin } from '../../../common/types/auth';

const LoginPage : React.FC<IPropsLogin> = (props: IPropsLogin) : JSX.Element => {
  const {navigate, register, errors} = props

  return (
    <>
      <Typography variant="h2" fontFamily='Poppins' textAlign='center'>Авторизация</Typography>
      <Typography variant="body1" fontFamily='Poppins' textAlign='center'>Введите ваш логин и пароль</Typography>
      <TextField
        error={!!errors.email}
        type='email' 
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
        error={!!errors.secondFactor}
        type='text' 
        fullWidth={true} 
        margin='normal' 
        label="Код двухфакторной аутентификации" 
        variant="outlined" 
        placeholder='Введите код двухфакторной аутентификации' 
        helperText={errors.secondFactor ? `${errors.secondFactor.message}` : ''}
        {...register('secondFactor', {
          required: 'Это обязательное поле',
          minLength: 6,
          maxLength: 6
        })}
        />
      <Button type="submit" sx={{fontFamily:'Poppins', marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Войти</Button>
      <Typography variant="body1" sx={{fontFamily:'Poppins'}}>Нет аккаунта?<span className='incitingText' onClick={() => navigate('/register')}>Регистрация</span></Typography>
    </>
  );
}

export default LoginPage;
