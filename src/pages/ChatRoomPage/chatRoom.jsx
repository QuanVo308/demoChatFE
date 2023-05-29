import { socket } from "../../services/socket";
import styles from "./chatRoom.module.css";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import Message from "../../components/ChatMessage/messageComponent";
import PeopleIcon from "@mui/icons-material/People";
import Typography from "@mui/material/Typography";

const sampleMessage = {
  name: "Person 1",
  message: "[[Person 4]] send message to [[Persion 2]] and [[Person 3]]",
  tags: ["Person2", "Person3"],
};

const ChatRoomPage = () => {
  const [senderName, setSenderName] = useState(null);
  const [senderMessage, setSenderMessage] = useState(null);
  const [senderRoom, setSenderRoom] = useState(null);
  const [inputRoom, setInputRoom] = useState("");
  const [memeberQuantity, setMemeberQuantity] = useState(0);
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => {
    function onConnect() {
      // console.log("connect");
    }

    function onDisconnect() {
      // console.log("disconnect");
    }

    function onRoomMessage(value) {
      if (senderRoom !== null) {
        setListMessage((prev) => [...prev, value]);
      }
      console.log("check", value);
    }

    function onChangeMember(value) {
      // console.log(value.member);
      setMemeberQuantity(value.member);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("roomMessage", onRoomMessage);
    socket.on("changeMemeber", onChangeMember);

    socket.emit("join", { room: "all" }, (response) => {
      if (response === "success") {
        setSenderRoom('"all"');
        // console.log("it success");
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("roomMessage", onRoomMessage);
      socket.off("changeMemeber", onChangeMember);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessageInput = (value) => {
    // console.log(value);
    setSenderMessage(value);
  };

  const handleJoinRoom = () => {
    if (inputRoom !== "") {
      socket.emit("join", { room: inputRoom }, (response) => {
        if (response === "success") {
          setSenderRoom(`"${inputRoom}"`);
          console.log("join success");
        }
      });
    }
  };

  const handleLeaveRoom = () => {
    if (senderRoom !== null) {
      socket.emit("leave", { room: senderRoom }, (response) => {
        if (response === "success") {
          setSenderRoom(null);
          console.log("leave success");
        }
      });
    }
  };
  const handleNameInput = (name) => {
    setSenderName(name);
    // console.log(name);
  };

  const handleRoomInput = (room) => {
    // console.log(room);
    setInputRoom(room);
  };

  const handleSendMessage = () => {
    console.log(senderMessage);
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
              fontSize: 30,
              color: "#f3f3f3",
              marginBottom: -0.4,
              cursor: "pointer",
            }}
          />{" "}
          <Typography
            fontSize={20}
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
            <Stack>
              <Message data={sampleMessage}></Message>
            </Stack>
          </Box>
          <Stack direction="row">
            <input
              className={styles.nameInput}
              placeholder="Tên"
              value={senderName}
              onChange={(e) => {
                handleNameInput(e.target.value);
              }}
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
                value={senderMessage}
                onChange={(e) => {
                  handleMessageInput(e.target.value);
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
                handleSendMessage();
              }}
            />
            {senderRoom === null ? (
              <>
                <Box width="5%" marginRight={"10px"} marginLeft={"10px"}>
                  <input
                    className={styles.messageInput}
                    placeholder="Phòng"
                    onChange={(e) => {
                      handleRoomInput(e.target.value);
                    }}
                  />
                </Box>
                <button
                  onClick={() => {
                    handleJoinRoom();
                  }}
                >
                  Join room
                </button>
              </>
            ) : (
              <button onClick={handleLeaveRoom}>Leave room {senderRoom}</button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatRoomPage;
