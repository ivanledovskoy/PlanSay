import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import PrivateRoute from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';
import "./App.css"

const URL = "https://i.imgur.com/L95wKD3.png"

function App() {
  return (
    <div className="background" style={{ backgroundImage: `url(${URL})` }}>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home/>}/>
        </Route>
        <Route path="login" element={<AuthRootComponent/>}/>
        <Route path="register" element={<AuthRootComponent/>}/>
      </Routes>
    </div>
  );
}

export default App;
