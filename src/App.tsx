import React, { useState } from 'react';
import './App.css';
import Login from './components/login/Login';
import Topbar from './components/topbar/Topbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/landing/Home';
import PlayTime from './components/playtime/PlayTime';
import Seat from './components/seat/Seat';

function App() {
  const [token,setToken] = useState(window.sessionStorage.getItem("token"));
  if (!token){
    return <Login />
  }
  return (
    <Router>
      <div className="App">
      <Topbar token={token} />
      <div className="container">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie_playtimes/:movieId" element={<PlayTime />} />
            <Route path="/seats/:movePlayTimeId" element={<Seat/>} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
