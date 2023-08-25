import styles from "./message.module.css";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, { useState, useEffect } from "react";

export default function Message(props) {
  const [tagSet, setTags] = useState([]);
  const [messageSet, setMessageSet] = useState([]);

  useEffect(() => {
    getMessageSplit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessageSplit = () => {
    var message = props.data.message;
    const tags = message?.match(/\[\[(.*?)\]\]/g);

    if (tags !== null) {
      const extractedTags = tags?.map((match) => {
        return match.slice(2, -2);
      });
      setTags(extractedTags);
      // console.log(tags);
      for (var tag of tags) {
        message = message.replace(tag, "$||");
      }
    } else {
      setTags(null);
    }

    setMessageSet(message.split("$||"));
  };

  const handleTag = (e) => {
    console.log(e);
    props.senderMessageRef.current.value += `[[${e}]]`;
    props.senderMessageRef.current.focus();
  };

  return (
    <Box marginTop={1.5}>
      <Stack direction="row">
        <Avatar
          alt="Remy Sharp"
          src={props.data.avatar_url}
          sx={{ width: 26, height: 26 }}
        />
        <Box paddingLeft={"10px"}>
          <>
            <span
              className={styles.senderName}
              onClick={(e) => {
                handleTag(e.currentTarget.textContent.slice(0, -2));
              }}
            >
              {props.data.name}:{" "}
            </span>

            {messageSet?.map((message, index) => {
              // console.log(messageSet);

              return (
                <>
                  <span className={styles.senderMessage}>{message}</span>
                  {tagSet !== null && (
                    <span
                      className={styles.senderTag}
                      onClick={(e) => {
                        handleTag(e.currentTarget.textContent.slice(0, -1));
                      }}
                    >
                      {tagSet[index]}{" "}
                    </span>
                  )}
                </>
              );
            })}
          </>
        </Box>
      </Stack>
    </Box>
  );
}
