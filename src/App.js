// import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from "react";
import { socket } from './services/socket';
import ChatRoomPage from './pages/ChatRoomPage/chatRoom';
import { Route, Routes } from "react-router-dom";



function App() {

  return (
    <Routes>
      <Route path="/" element={<ChatRoomPage />} />
    </Routes>
  );
}

export default App;
