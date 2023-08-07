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
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
// import Cookies from "universal-cookie";
import { AuthenticationService } from "../../services/authen.service";
import GoogleButton from "react-google-button";
import Cookies from "js-cookie";
import axios from "axios";

var websocketService;
const messageDefaultQuantity = 30;
var authenticationService;

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
  const [userInfo, setUserInfo] = useState(null);

  websocketService = new WebSocketService();
  authenticationService = new AuthenticationService();

  const saveUserInfo = (info) => {
    setUserInfo(info);
    Cookies.set("userInfo", JSON.stringify(info));
  };

  const saveUsertoken = (token) => {
    setUserToken(token);
    Cookies.set("userToken", token);
    Cookies.set("Authentication", token);
  };

  const alreadyLogin = async (token) => {
    saveUsertoken(token);
    const response = await authenticationService.getUser();
    console.log("response123", response);
    if (response && response.status === 200) setUserInfo(response.data);
  };
  useEffect(() => {
    if (currentURL.searchParams.get("token")) {
      console.log("check2", currentURL.searchParams.get("token"));
      alreadyLogin(currentURL.searchParams.get("token"));
    } else {
      try {
        if (Cookies.get("userToken")) {
          setUserInfo(Cookies.get("userToken"));
        }
        if (Cookies.get("userInfo")) {
          setUserInfo(Cookies.get("userInfo"));
        }
      } catch {}
    }
    try {
      websocketService.closeConnection();
    } catch {}

    websocketService.init(
      `ws://${process.env.REACT_APP_SOCKET_HOST}/api/room/${currentRoom}/websocket`,
      setSenderRoom,
      setMemeberQuantity,
      setListMessage,
      logout
    );
    setSenderRoom(currentRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useState(() => {
    try {
      websocketService.setUserToken(Cookies.get("userToken"));
    } catch {}
  }, [userToken]);

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

  const handleGoogleLoginSuccess = (token) => {
    authenticationService.googleLogin(token).then((response) => {
      console.log("response", response);
      if (response.status.toString()[0] !== "2") {
        handleLoginFail();
      } else {
        saveUserInfo(response.data.user);
        saveUsertoken(response.data.token);

        const data = {
          type: "login",
          token: response.data.token,
        };
        websocketService.sendMessageRoom(data);
      }
    });

    // axios
    //   .get(
    //     `https://people.googleapis.com/v1/people/${googleId}?personFields=birthdays,genders&access_token=${token}`
    //   )
    //   .then((response) => {
    //     console.log(JSON.stringify(response, null, 4));
    //   }) //You will get data here
    //   .catch((error) => {
    //     console.warn(JSON.stringify(error, null, 4));
    //   });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("tokenResponse", tokenResponse);
      handleGoogleLoginSuccess(tokenResponse.access_token);
    },
    scope:
      "https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/userinfo.profile",
  });

  useGoogleOneTapLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleLoginSuccess(tokenResponse.credential);
    },
    disabled: userInfo === null ? false : true,
  });

  const handleLoginFail = () => {
    console.log("login fail");
  };

  const handleSendMessage = (e) => {
    const data = {
      type: "message_room",
      room: `${senderRoom}`,
      senderName: userInfo.name === "" ? "annonymous" : `${userInfo.name}`,
      senderAva: userInfo.avatar_url,
      message: `${senderMessageRef.current.value}`,
      messageId: Math.floor((Math.random() + 0.1) * 10 ** 10).toString(16),
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

  const test = async () => {
    console.log(userToken);
    authenticationService.getUser(userToken);
  };
  const logout = () => {
    authenticationService.logout();
    setUserToken(null);
    setUserInfo(null);
    Cookies.remove("userInfo");
    Cookies.remove("userToken");
    Cookies.remove("Authentication");
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
              {userInfo === null ? (
                // <GoogleOAuthProvider
                //   clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
                // >
                // <GoogleLogin
                //   onSuccess={(token) => {
                //     login();
                //   }}
                //   onError={() => {
                //     console.log("
                //   useOneTap
                // />
                <>
                  <GoogleButton
                    label="Sign in with Google"
                    onClick={() => {
                      login();
                    }}
                  />
                </>
              ) : (
                // </GoogleOAuthProvider>
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
              <button
                onClick={() => {
                  logout();
                }}
              >
                logout
              </button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatRoomPage;
