import React from 'react';
import App from './App';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import * as MicroStacks from '@micro-stacks/react';

import './index.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Chats from './pages/Chats';
import Login from './pages/Login';
import BuyFirstKey from './pages/BuyFirstKey';
import { StacksMocknet } from 'micro-stacks/network';
import ChatRoomUI from './pages/ChatRoomUI';

const devnet = new StacksMocknet({ coreApiUrl: 'http://localhost:3999' });

createRoot(document.getElementById('root') as HTMLElement).render(
  <MicroStacks.ClientProvider
    appName="sFriend.tech"
    appIconUrl="APP_ICON.png"
    network={devnet}
  >
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/buy-first-key" element={<BuyFirstKey />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/chats" element={<Chats />} />
          <Route path="/chatRoom" element={<ChatRoomUI />} />
          <Route path="/profile/:slug" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </MicroStacks.ClientProvider>
);
