import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import PrivateRoute from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';
import "./App.css"
import LayoutComponent from './components/layout';
import TodayComponent from './components/today';
import CalendarComponent from './components/calendar';

const URL = "https://i.imgur.com/L95wKD3.png"

function App() {
  return (
    <LayoutComponent>
      <div>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home/>}/>
            <Route path="/today" element={<TodayComponent/>}/>
            <Route path="/calendar" element={<CalendarComponent/>}/>
          </Route>
          <Route path="login" element={<AuthRootComponent/>}/>
          <Route path="register" element={<AuthRootComponent/>}/>
        </Routes>
      </div>
    </LayoutComponent>
  );
}

export default App;
