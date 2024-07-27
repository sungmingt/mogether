import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './pages/Auth/LoginPage';
// import Register from './pages/Auth/RegisterPage';
import Home from './pages/Home';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path = "/login" element = {<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App;