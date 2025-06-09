import React, { JSX, useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { IPropsLogin } from '../../../common/types/auth';
import AppLoadingButton from '../../loading-button';
import { useAppDispatch, useAppSelector } from '../../../utils/hook';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginPage : React.FC<IPropsLogin> = (props: IPropsLogin) : JSX.Element => {
  const {navigate, register, errors} = props
  const loading = useAppSelector(state => state.auth.isLoading)

  const [capVal, setCapVal] = useState(false);

  return (
    <>
      <Typography variant="h3" fontFamily='Poppins' textAlign='center'>Авторизация</Typography>
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
          required: 'Это обязательное поле',
          minLength: 8,
          maxLength: 30
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
        sx={{marginBottom: 3}}
        />
        <ReCAPTCHA
        sitekey='6Le-uzgrAAAAADRDse82KQKnUC_6h6Z2o-w8XEVh'
        onChange={(val: any) => setCapVal(val)}>
        </ReCAPTCHA>
      <AppLoadingButton disabled={!capVal} loading={loading} type="submit" sx={{ marginTop: 2, marginBottom: 1, width: '60%'}} variant="contained">Войти</AppLoadingButton>
      <Typography variant="body1" sx={{fontFamily:'Poppins'}}>Нет аккаунта?<span className='incitingText' onClick={() => navigate('/register')}>Регистрация</span></Typography>
    </>
  );
}

export default LoginPage;
