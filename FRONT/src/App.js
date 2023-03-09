import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Board from './Board';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/board" element={<Board/>} />
      </Routes>
    </Router>
  );
};

export default App;