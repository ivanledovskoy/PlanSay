import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import PrivateRoute from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';
import "./App.css"

const URL = "https://24warez.ru/uploads/posts/280717/280114/1.jpg"
// const URL = "https://remarklee.ru/upload/sprint.editor/354/lle4buclfk6zkde4bh9ae5442dad4k20.jpg"

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
