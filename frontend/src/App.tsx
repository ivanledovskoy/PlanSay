import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import InboxComponent from './pages/inbox';
import PrivateRoute, { AccountRoute, AdminRoute } from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';
import "./App.css"
import LayoutComponent from './components/layout';
import TodayComponent from './pages/today';
import AccountComponent from './pages/account';
import CalendarComponent from './pages/calendar';
import { ColorModeContext, useMode } from './theme';
import {CssBaseline, ThemeProvider} from '@mui/material'
import LogoutComponent from './pages/logout';
import AdminComponent from './pages/admin';
import TelegramComponent from './pages/telegram';

const URL = "https://i.imgur.com/L95wKD3.png"

function App() {
  const [theme, colorMode] = useMode()

  return (
    <ColorModeContext.Provider value={colorMode}>
       <ThemeProvider theme={theme}>
         <CssBaseline />
        <LayoutComponent>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/today" element={<TodayComponent/>}/>
                <Route path="/calendar" element={<CalendarComponent/>}/>
                <Route path="/inbox" element={<InboxComponent/>}/>
                <Route path="/logout" element={<LogoutComponent/>}/>
                <Route path="/telegram-bot" element={<TelegramComponent/>}/>
              </Route>
              <Route element={<AccountRoute />}>
                <Route path="/account" element={<AccountComponent/>}/>
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminComponent/>}/>
              </Route>
              <Route path="/login" element={<AuthRootComponent/>}/>
              <Route path="/register" element={<AuthRootComponent/>}/>
            </Routes>
        </LayoutComponent>
       </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
