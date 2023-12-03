import React from 'react';
import App from './App';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import './index.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Chats from './pages/Chats';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
