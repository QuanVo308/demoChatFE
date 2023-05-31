// import { socket } from "../../services/socketIO";
import styles from "./chatRoom.module.css";
import React, { useEffect, useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import Message from "../../components/ChatMessage/messageComponent";
import PeopleIcon from "@mui/icons-material/People";
import Typography from "@mui/material/Typography";
import { WebSocketService } from "../../services/websocket.service";

// websocketService.init("ws://localhost:8080")
var websocketService;

const ChatRoomPage = () => {
  const [senderRoom, setSenderRoom] = useState(null);
  const [memeberQuantity, setMemeberQuantity] = useState(0);
  const [listMessage, setListMessage] = useState([]);
  const senderMessageRef = useRef(null);
  const senderNameRef = useRef(null);
  const inputRoom = useRef(null);

  useEffect(() => {
    websocketService = new WebSocketService();
    websocketService.init(
      "ws://localhost:8080",
      setSenderRoom,
      setMemeberQuantity,
      setListMessage
    );
  }, []);

  const handleJoinRoom = () => {
    if (inputRoom.current.value !== "") {
      websocketService.joinRoom(inputRoom.current.value);
    }
  };

  const handleLeaveRoom = () => {
    if (senderRoom !== null) {
      websocketService.leaveRoom(senderRoom);
    }
  };

  const handleSendMessage = (e) => {
    const data = {
      type: "message_room",
      room: `${senderRoom}`,
      sender: `${senderNameRef.current.value}`,
      message: `${senderMessageRef.current.value}`,
    };

    websocketService.sendMessageRoom(data);
  };

  const handleEnterMessage = (e) => {
    if (e.key === "Enter") {
      if (
        senderMessageRef.current.value !== null &&
        senderNameRef.current.value !== null
      ) {
        handleSendMessage(e);
      }
    }
  };

  const handleEnterRoom = (e) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  const test = () => {
    // console.log("test");
    websocketService.ws.send(
      JSON.stringify({
        type: "message_all",
        name: "quan",
      })
    );
  };

  return (
    <Box sx={{ bgcolor: "#262626", height: "100vh" }}>
      <Stack>
        <Box
          sx={{
            height: "4vh",
            display: "flex",
            justifyContent: "flex-end",
            justifyItems: "end",
            // bgcolor: "white",
          }}
        >
          <PeopleIcon
            sx={{
              fontSize: 20,
              color: "#f3f3f3",
              marginBottom: -0.4,
              cursor: "pointer",
            }}
          />{" "}
          <Typography
            fontSize={14}
            fontWeig={600}
            color="white"
            sx={{
              paddingLeft: "4px",
            }}
          >
            {memeberQuantity}
          </Typography>
        </Box>
        <Stack
          sx={{ height: "96vh", display: "flex", justifyContent: "flex-end" }}
        >
          <Box margin="10px">
            <Stack spacing={1}>
              {listMessage?.map((messageData) => {
                // console.log(messageData);
                return (
                  <Message
                    data={messageData}
                    senderMessageRef={senderMessageRef}
                  ></Message>
                );
              })}
              .
            </Stack>
          </Box>
          <Stack direction="row">
            <input
              className={styles.nameInput}
              placeholder="Tên"
              ref={senderNameRef}
              // value={senderNameRef.current.value}
              // onChange={(e) => {
              //   handleNameInput(e.target.value);
              // }}
            />
            <Box
              width="80%"
              // bgcolor={"white"}
              marginRight={"10px"}
              marginLeft={"10px"}
            >
              <input
                className={styles.messageInput}
                placeholder="Tin nhắn"
                ref={senderMessageRef}
                // value={senderMessage}
                // onChange={(e) => {
                //   handleMessageInput(e);
                // }}
                onKeyDown={(e) => {
                  handleEnterMessage(e);
                }}
              />
            </Box>
            <SendIcon
              sx={{
                fontSize: 30,
                paddingRight: 1,
                color: "#f3f3f3",
                marginBottom: -0.4,
                cursor: "pointer",
              }}
              onClick={() => {
                if (senderMessageRef.current.value !== null) {
                  handleSendMessage();
                }
              }}
            />
            {senderRoom === null ? (
              <>
                <Box width="5%" marginRight={"10px"} marginLeft={"10px"}>
                  <input
                    className={styles.messageInput}
                    placeholder="Phòng"
                    // onChange={(e) => {
                    //   handleRoomInput(e.target.value);
                    // }}
                    onKeyDown={(e) => {
                      handleEnterRoom(e);
                    }}
                    ref={inputRoom}
                  />
                </Box>
                <button
                  onClick={() => {
                    handleJoinRoom();
                  }}
                >
                  Join room
                </button>
                <button
                  onClick={() => {
                    test();
                  }}
                >
                  test
                </button>
              </>
            ) : (
              <button onClick={handleLeaveRoom}>
                Leave room "{senderRoom}"
              </button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatRoomPage;
