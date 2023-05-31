// import logo from './logo.svg';
import './App.css';
import React from "react";
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
