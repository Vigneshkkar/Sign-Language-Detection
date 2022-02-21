import React from 'react';
import logo from './logo.svg';
import './App.scss';
import RecordVideo from './screens/RecordVideo';
import Room from './screens/Room';
import ChatRoom from './screens/ChatRoom';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './screens/Home';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='chat/:RoomId/:userName' element={<ChatRoom />} />
    </Routes>
  );
}

export default App;
