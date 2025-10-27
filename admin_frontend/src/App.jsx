import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import FeedbackAdmin from '../pages/FeedbackAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feedbacks" element={<FeedbackAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;