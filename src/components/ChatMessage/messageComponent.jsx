import styles from "./message.module.css";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Message(props) {
    const getTagName = () => {
        var result = ''
        for (const name of props.data.tags) {
            result+= ' ' + name
        }
        return result
    }
  return (
    <Box >
      <Stack direction="row">
        <Avatar
          alt="Remy Sharp"
          src="https://cdn.vox-cdn.com/thumbor/Si2spWe-6jYnWh8roDPVRV7izC4=/0x0:1192x795/1400x788/filters:focal(596x398:597x399)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg"
          sx={{ width: 26, height: 26 }}
        />
        <Box paddingLeft={'10px'}>
          <>
            <span className={styles.senderName}>{props.data.name}:</span><span className={styles.senderTag}>{getTagName()}</span> <span className={styles.senderMessage}>{props.data.message}</span>
          </>
        </Box>
        {/* <Typography
          fontSize={12}
          fontWeig={600}
          color="#FAAB2B"
          sx={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
            cursor: "pointer",
          }}
        >
          {props.data.name}:
        </Typography>
        {props.data.tags?.map((name) => {
            return <Typography
            fontSize={12}
            fontWeight={600}
            color="#178E3A"
            sx={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "4px",
            }}
          >
            {name}
          </Typography>
        })}
        <Typography
          fontSize={12}
          fontWeight={600}
          color="white"
          sx={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
          }}
        >
          {props.data.message}
        </Typography> */}
      </Stack>
    </Box>
  );
}
