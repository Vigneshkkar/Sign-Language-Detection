import React from 'react';
import logo from './logo.svg';
import './App.scss';
import RecordVideo from './screens/RecordVideo';
import Room from './screens/Room';
import ChatRoom from './screens/ChatRoom';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './screens/Home';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const themeOptions = createTheme({
  typography: {
    fontFamily: [
      'Hubballi',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    type: 'light',
    primary: {
      main: '#5a31fd',
    },
    secondary: {
      main: '#e84855',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={themeOptions}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='chat/:RoomId/:userName' element={<ChatRoom />} />
        <Route path='record' element={<RecordVideo />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
