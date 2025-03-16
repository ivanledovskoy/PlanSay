import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginPage from './login';
import RegisterPage from './register';
import Box from '@mui/material/Box';
import './style.css'

const AuthRootComponent = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secondFactor, setSecondFactor] = useState('')
    const location = useLocation()

    const handleClick = async (event:any) => {
        console.log(email)
        console.log(password)
        console.log(secondFactor)
    }
    
    return (
        <div className='root'>
            <div className='form' onClick={handleClick}>
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
                    {(location.pathname === '/login' ? <LoginPage setEmail={setEmail} setPassword={setPassword} setSecondFactor={setSecondFactor}/> : location.pathname === '/register' ? <RegisterPage /> : null)}
                </Box>
            </div>
        </div>
    )
}

export default AuthRootComponent;
