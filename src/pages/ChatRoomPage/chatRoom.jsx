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
import {
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import jwt_decode from "jwt-decode";

// websocketService.init("ws://localhost:8080")
var websocketService;
const messageDefaultQuantity = 30;

const ChatRoomPage = () => {
  const [senderRoom, setSenderRoom] = useState(null);
  const [memeberQuantity, setMemeberQuantity] = useState(0);
  const [listMessage, setListMessage] = useState([]);
  const [scrollable, setScrollable] = useState({ value: true });
  const senderMessageRef = useRef(null);
  const messageEndRef = useRef(null);
  const messageListdRef = useRef(null);
  const currentURL = new URL(window.location.href);
  const currentRoom = currentURL.pathname.slice(1).split("/")[2];
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    websocketService = new WebSocketService();

    websocketService.init(
      `ws://${process.env.REACT_APP_SOCKET_HOST}/api/room/${currentRoom}/websocket`,
      setSenderRoom,
      setMemeberQuantity,
      setListMessage
    );
    setSenderRoom(currentRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    if (scrollable.value) {
      messageEndRef.current?.scrollIntoView();
      handleReduceMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listMessage]);

  const handleReduceMessage = () => {
    if (scrollable) {
      const end_idx = Math.min(listMessage.length, messageDefaultQuantity);
      const start_idx = Math.max(1, end_idx - messageDefaultQuantity);
      if (listMessage.length > end_idx) {
        setListMessage((current) => {
          return current.slice(start_idx, end_idx + 2);
        });
      }
      // listMessage = listMessage.slice(start_idx, end_idx + 1)
    }
  };

  const handleSendMessage = (e) => {
    const data = {
      type: "message_room",
      room: `${senderRoom}`,
      senderName: userToken.name === "" ? "annonymous" : `${userToken.name}`,
      senderAva: userToken.picture,
      message: `${senderMessageRef.current.value}`,
      messageId: Math.floor(Math.random() * 10 ** 10).toString(16),
    };
    setScrollable({ value: true });
    websocketService.sendMessageRoom(data);
    senderMessageRef.current.value = null;
    console.log(listMessage);
  };

  const handleEnterMessage = (e) => {
    if (e.key === "Enter") {
      if (senderMessageRef.current.value !== "") {
        handleSendMessage(e);
      }
    }
    handleReduceMessage();
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

  const throt_checkScroll = _.throttle(handleScrollMessage, 100);

  const test = () => {
    // let currentDate = new Date();
    setUserToken(null);
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
              onWheel={() => throt_checkScroll()}
            >
              {listMessage?.map((messageData) => {
                return (
                  <Message
                    data={messageData}
                    senderMessageRef={senderMessageRef}
                    key={messageData.messageId}
                  ></Message>
                );
              })}
              <div ref={messageEndRef}></div>
            </div>
          </Box>
          <Stack direction="row">
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.322)",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingBottom: "2px",
              }}
            >
              {userToken === null ? (
                <GoogleOAuthProvider clientId="647320167649-rul88b2pdip6s6qhmiap1ceqb1977ih4.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      console.log(credentialResponse.credential);
                      const credential = jwt_decode(
                        credentialResponse.credential
                      );
                      console.log(credential);
                      setUserToken(credential);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    useOneTap
                  />
                </GoogleOAuthProvider>
              ) : (
                <>
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
                </>
              )}
              <button
                onClick={() => {
                  test();
                }}
              >
                test
              </button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatRoomPage;
