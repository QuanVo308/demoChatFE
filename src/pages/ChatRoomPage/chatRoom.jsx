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
import _ from "lodash";

// websocketService.init("ws://localhost:8080")
var websocketService;

const ChatRoomPage = () => {
  const [senderRoom, setSenderRoom] = useState(null);
  const [memeberQuantity, setMemeberQuantity] = useState(0);
  const [listMessage, setListMessage] = useState([]);
  const [scrollable, setScrollable] = useState({ value: true });
  const senderMessageRef = useRef(null);
  const senderNameRef = useRef(null);
  const inputRoomRef = useRef(null);
  const messageEndRef = useRef(null);
  const messageListdRef = useRef(null);

  useEffect(() => {
    websocketService = new WebSocketService();
    websocketService.init(
      process.env.REACT_APP_SOCKET_SERVER,
      setSenderRoom,
      setMemeberQuantity,
      setListMessage
    );
  }, []);

  const scrollToBottom = () => {
    if (scrollable.value) {
      messageEndRef.current?.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listMessage]);

  const handleJoinRoom = () => {
    if (inputRoomRef.current.value !== "") {
      websocketService.joinRoom(inputRoomRef.current.value);
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
      sender:
        senderNameRef.current.value === ""
          ? "annonymous"
          : `${senderNameRef.current.value}`,
      message: `${senderMessageRef.current.value}`,
    };
    setScrollable({ value: true });
    websocketService.sendMessageRoom(data);
    senderMessageRef.current.value = null;
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

  const handleScrollMessage = () => {
    const check =
      messageListdRef.current.scrollHeight -
        messageListdRef.current.scrollTop -
        messageListdRef.current.clientHeight <
      40;
    if (check !== scrollable.value) {
      // setScrollable(check);
      scrollable.value = check;
    }
  };

  // const throt_checkScroll = _.throttle(handleScrollMessage, 100);

  const test = () => {
    console.log(process.env.REACT_APP_SOCKET_SERVER);
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
            fontWeight={600}
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
          <Box margin="10px" sx={{ maxHeight: "100%" }}>
            <div
              className={styles.messageList}
              ref={messageListdRef}
              onWheel={() => handleScrollMessage()}
              // onWheel={(e) => test_wheel(e)}
            >
              {listMessage?.map((messageData, idx) => {
                return (
                  <Message
                    data={messageData}
                    senderMessageRef={senderMessageRef}
                    key={idx}
                  ></Message>
                );
              })}
              <div ref={messageEndRef}></div>
            </div>
          </Box>
          <Stack direction="row">
            <input
              className={styles.nameInput}
              placeholder="Tên"
              ref={senderNameRef}
            />
            <Box width="80%" marginRight={"10px"} marginLeft={"10px"}>
              <input
                className={styles.messageInput}
                placeholder="Tin nhắn"
                ref={senderMessageRef}
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
                    ref={inputRoomRef}
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
