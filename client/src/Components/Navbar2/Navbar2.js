import { React, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/cw-logo.png";
import NewButton from "../Button/NewButton";

export default function Navbar2() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const currentPage = window.location.pathname;

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleClick = async () => {
    setIsLoading(true);
    navigate("/signup");
  };

  const buttonStyle = {
    width: "5%",
    fontWeight: "bold",
    color: "#273646",
    "&:hover": {
      backgroundColor: "white",
      textDecoration: "underline", // Change the background color on hover
    },
  };

  const specialButtonStyle = {
    width: "20%",
    fontWeight: "normal", // Change fontWeight to normal
    textTransform: "none", // Prevent text from being displayed in all caps
    color: "#273646",
    fontFamily: "Poppins, sans-serif", // Set font to Poppins
    border: "1px solid #FF6F1A",
    "&:hover": {
      backgroundColor: "white",
      color: "#FF6F1A", // Change the text color on hover
    },
    "&:hover .MuiCircularProgress-svg": {
      color: "orange", // Change loader color to orange on hover
    },
  };

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 9999, width: "100%" }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          paddingLeft: 4,
          paddingRight: 4,
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0), 0px 1px 10px 0px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ height: 80, cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </Box>
          {/* Links */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              color: "black",
            }}
          >
            <NewButton
              sx={{
                ...buttonStyle,
                fontFamily: "Poppins, sans-serif", // Set font to Poppins
                textTransform: "none", // Prevent text from being displayed in all caps
                fontSize: "1rem", // Adjust font size as needed
                fontWeight: "normal",
                color: currentPage == "/pricing" ? "#FF6F1A" : "#273646",
              }}
              onClick={() => navigate("/pricing")}
              text="Pricing"
            />
            <NewButton
              onClick={() => navigate("/contact-us")}
              sx={{
                ...buttonStyle,
                width: "20%",
                marginRight: 1,
                fontFamily: "Poppins, sans-serif", // Set font to Poppins
                textTransform: "none", // Prevent text from being displayed in all caps
                fontSize: "1rem", // Adjust font size as needed
                fontWeight: "normal",
                color: currentPage == "/contact-us" ? "#FF6F1A" : "#273646",
              }}
              text="Contact Us"
            />
            {/* <Link to="/login"> */}
            {/* <NewButton
                    sx={{ ...specialButtonStyle, backgroundColor: '#FF6F1A', color: 'white', width: '15%', borderRadius: '0px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)' }}
                    onClick={handleClick}
                    isLoading={isLoading}
                    text="Sign Up"
                /> */}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
