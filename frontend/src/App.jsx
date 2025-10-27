import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import FeedbackAdmin from '../pages/FeedbackAdmin';
import Form from '../pages/Form';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/feedbacks" element={<FeedbackAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;