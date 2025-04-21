import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import PrivateRoute from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';

function App() {
  return (
    <div className="app">
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
