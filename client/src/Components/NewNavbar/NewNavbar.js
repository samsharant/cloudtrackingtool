import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink instead of Link
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import logo from "../../Assets/logoNoTaglineWhite.png";
import { logout as logoutAction } from "../../redux/_actions/logoutAction";
import { useActions } from "../../Utils";
import { useNavigate } from "react-router-dom";
// import logo from "../../Assets/cw-logo.png";

export default function NewNavbar(props) {
  const {
    firstName,
    updateLogin,
    setNetworkInventoryError,
    setDelayError,
  } = props;
  const currentPage = window.location.pathname;
  const [logout] = useActions([logoutAction]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logoutUser = () => {
    setIsLoading(true);

    setTimeout(() => {
      setNetworkInventoryError(false);
      setDelayError(false);
      updateLogin(false);
      setIsLoading(false);
      navigate("/login");
    }, 700); // 1000 milliseconds = 1 second
  };

  const navLinkStyle = {
    fontSize: "0.85rem", // Adjust the font size as needed
    textTransform: "none",
    fontWeight: "normal",
    padding: "0 1rem",
  };

  const highlightedNavLink = {
    ...navLinkStyle,
    color:
      currentPage === "/newdashboard" ||
      currentPage === "/dashboard" ||
      currentPage === "/newinventory" ||
      currentPage === "/inventory"
        ? "#FF9C62"
        : "white", // Change color based on the current page
    // textDecoration: "underline", // Initial textDecoration
    "&:hover": {
      textDecoration: "underline", // textDecoration on hover
    },
  };

  const nonHighlightedNavLink = {
    ...navLinkStyle,
    color: "white",
    "&:hover": {
      textDecoration: "underline", // textDecoration on hover
    },
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#273646" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: 24, marginRight: 20, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              backgroundColor: "#FF6F1A",
              height: "2.5em",
              marginLeft: 2,
              marginRight: 3,
            }}
          />
          <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
            {" "}
            {/* Use NavLink */}
            <Button
              color="inherit"
              sx={
                currentPage === "/newdashboard" || currentPage === "/dashboard"
                  ? highlightedNavLink
                  : nonHighlightedNavLink
              }
            >
              Dashboard
            </Button>
          </NavLink>
          <NavLink to="/inventory" style={{ textDecoration: "none" }}>
            {" "}
            {/* Use NavLink */}
            <Button
              color="inherit"
              sx={
                currentPage === "/newinventory" || currentPage === "/inventory"
                  ? highlightedNavLink
                  : nonHighlightedNavLink
              }
            >
              Inventory
            </Button>
          </NavLink>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              marginRight: 1,
              marginLeft: 2,
              color: "#FFFFFF",
              fontSize: "0.75rem",
              fontWeight: "400",
            }}
          >
            Hello {firstName || "Guest User"}
          </Typography>
          <Tooltip title="Logout" arrow>
            <IconButton
              onClick={() => logoutUser()}
              color="inherit"
              aria-label="search"
              sx={{
                marginRight: 3,
              }}
            >
              {isLoading ? (
                <CircularProgress style={{ color: "white" }} size={14} />
              ) : (
                <PowerSettingsNewIcon sx={{ fontSize: "0.9rem" }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
