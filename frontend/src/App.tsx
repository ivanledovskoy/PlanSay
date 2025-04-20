import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import InboxComponent from './pages/inbox';
import PrivateRoute from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';
import "./App.css"
import LayoutComponent from './components/layout';
import TodayComponent from './pages/today';
import CalendarComponent from './pages/calendar';
import { ColorModeContext, useMode } from './theme';
import {CssBaseline, ThemeProvider} from '@mui/material'

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
                <Route path="/" element={<Home/>}/>
                <Route path="/today" element={<TodayComponent/>}/>
                <Route path="/calendar" element={<CalendarComponent/>}/>
                <Route path="/inbox" element={<InboxComponent/>}/>
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
