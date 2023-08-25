// import logo from './logo.svg';
import './App.css';
import React from "react";
import ChatRoomPage from './pages/ChatRoomPage/chatRoom';
import { Route, Routes } from "react-router-dom";



function App() {

  return (
    <Routes>
      <Route path="/vebotv/chat" element={<ChatRoomPage />} />
      <Route path="" element={
        <>
          <div>Kính gửi Quý khách hàng,</div>
          <div>Cám ơn bạn đã đăng ký thành viên của 90PhutTV. Để xác minh địa chỉ email của Quý khách hàng (email kh) vui làm làm theo hướng dẫn sau:</div>
          <div>1. Bấm vào  <a href="http://www.facebook.com">đây</a> để hoàn tất đăng ký.</div>
          <div>2. Trong trường hợp đường dẫn không kích hoạt được, vui lòng sử dụng trình duyệt web để mở bằng cách cắt dán toàn bộ địa chỉ đường dẫn lên thanh địa chỉ: (đường link)</div>
          <div>Trân trọng,</div>
          <div>Đội ngũ 90PhutTV</div>
          ----------
          <div>Trang chủ: https://bit.ly/tiengruoi</div>
          <div>Fanpage: https://www.facebook.com/90phutTV</div>
        </>} />
    </Routes>
  );
}

export default App;
