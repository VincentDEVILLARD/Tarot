import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CelticCross from './CrossOfLife.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/Tarot">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/croix" element={<CelticCross />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
); 