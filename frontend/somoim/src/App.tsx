import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/LoginPage';
import Register from './pages/Auth/RegisterPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/login" element = {<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App;