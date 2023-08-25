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

var websocketService;
const messageDefaultQuantity = 30;
let host = null;

const ChatRoomPage = () => {
  const [login, setLogin] = useState(false);
  const [memeberQuantity, setMemeberQuantity] = useState(0);
  const [listMessage, setListMessage] = useState([]);
  const [scrollable, setScrollable] = useState({ value: true });
  const senderMessageRef = useRef(null);
  const messageEndRef = useRef(null);
  const messageListdRef = useRef(null);
  const currentURL = new URL(window.location.href);
  const roomToken = encodeURIComponent(currentURL.searchParams.get("token"));

  useEffect(() => {
    websocketService = new WebSocketService();
    host = new WebSocket(
      `${process.env.REACT_APP_SOCKET_HOST}/vebotv?token=${roomToken}`
    );

    try {
      websocketService.closeConnection();
    } catch {}

    websocketService.init(
      host,

      setMemeberQuantity,
      setListMessage,

      setLogin
    );

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
    }
  };

  const handleSendMessage = (e) => {
    const data = {
      type: "message_room",
      // room: `${senderRoom}`,
      // senderName: userInfo.name === "" ? "annonymous" : `${userInfo.name}`,
      // senderAva: userInfo.avatar_url,
      message: `${senderMessageRef.current.value}`,
      messageId: Math.floor((Math.random() + 0.1) * 10 ** 10).toString(16),
    };
    setScrollable({ value: true });
    console.log(websocketService.ws);
    websocketService.sendMessageRoom(data, host);
    senderMessageRef.current.value = null;
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
              {login === false ? (
                <></>
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
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatRoomPage;
