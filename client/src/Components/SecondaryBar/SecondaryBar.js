import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import cloudLogo from "../../Assets/ckoud.png";
import Refresh from "@mui/icons-material/Refresh";
import { logout as logoutAction } from "../../redux/_actions/logoutAction";

export default function SecondaryBar(props) {
  const { accountName, hoursLeft } = props;
  function getHoursUntilMidnight() {
    // Get the current date
    const now = new Date();

    // Calculate the time until the next midnight
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to next midnight

    // Calculate the difference in milliseconds between now and midnight
    const timeUntilMidnight = midnight - now;

    // Convert milliseconds to hours
    const hoursUntilMidnight = Math.floor(timeUntilMidnight / (1000 * 60 * 60));
    const minutesUntilMidnight = Math.floor((timeUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));

    return [ hoursUntilMidnight, minutesUntilMidnight ];
  }

  // Example usage
  const [hour, minutes] = getHoursUntilMidnight();
  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "0px !important",
        padding: "1rem 1rem",
        borderBottom: "1px solid black",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton color="inherit" style={{ pointerEvents: "none" }}>
          <img src={cloudLogo} alt="Cloud" style={{ width: 24, height: 24 }} />
        </IconButton>
        <Typography variant="body1" sx={{ marginRight: 1, fontSize: "0.9rem" }}>
          Cloud Account:
        </Typography>
        <Typography variant="body1" sx={{ color: "#FF6F1A" }}>
          {accountName}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton style={{ pointerEvents: "none" }}>
          <Refresh sx={{ color: "#FF6F1A !important" }} />
        </IconButton>
        <Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
          Cost will be Refreshed in { hour!=0 ? `${hour} hours` : `${minutes} minutes` }
        </Typography>
      </Box>
    </Toolbar>
  );
}
