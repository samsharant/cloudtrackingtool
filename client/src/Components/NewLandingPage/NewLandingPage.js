import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Input, InputLabel, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import FooterCopyright from "../FooterCopyright/FooterCopyright";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../redux/_actions/authActions";
import { useActions } from "../../Utils";

import {
  isLoggedInSelector,
  nextPageSelector,
} from "../../redux/_selectors/authSelector";

import { useSelector } from "react-redux";
import { Link as RedirectTo } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Copyright from "../Copyright.js/Copyright";
import logo from "../../Assets/cw-logo.png";
import carousel1 from "../../Assets/illustration1.png";
import carousel2 from "../../Assets/illustration2.png";
import carousel3 from "../../Assets/illustration3.png";
import loginCostBreakup from "../../Assets/loginCostBreakup.PNG";
import loginTotalCost from "../../Assets/loginTotalCost.PNG";
import useMediaQuery from "@mui/material/useMediaQuery";
import poster1 from "../../Assets/cw-loginPoster1.PNG";
import poster2 from "../../Assets/cw-loginPoster2.PNG";
import laptopPoster from "../../Assets/cw-laptopPoster.png";
import "./NewLandingPage.css";
import EastIcon from "@mui/icons-material/East";
// TODO remove, this demo shouldn't need to reset the theme.
function NewLandingPage(props) {
  const { isLoggedIn } = props;
  const linkStyles = {
    textDecoration: "none",
    color: "inherit",
    display: "inline-block", // Add this line to set display to inline-block
  };
  const buttonStyle = {
    width: "20%",
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
      backgroundColor: "#FF6F1A",
      color: "#ffffff", // Change the text color on hover
    },
  };
  const innerButtonStyle = {
    // padding: '5px',
    width: "20%",
    backgroundColor: "#FF6F1A",
    color: "white",
    border: "1px solid #FF6F1A",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#FF6F1A", // Change the text color on hover
    },
  };

  const isLoading = false;
  const images = [carousel1, carousel2, carousel3];
  const carouselTexts = [
    "Analyze skills for improved cost efficiency",
    "Enhance cloud management with precise analytics using our inspector tool.",
    "Cost Analytics, charted for your Insightful Explanation",
  ];
  const navigate = useNavigate();
  const handleGetStarted = () => {
    // if (isLoggedIn) {
    //   navigate("/dashboard");
    // } else {
    navigate("/login");
    // }
  };

  return (
    <div className="landing-wrapper">
      <Grid
        container
        columnGap={0}
        rowGap={0}
        flex
        sx={{ justifyContent: "center" }}
      >
        <Grid
          item
          xs={7}
          className="grid-item-landing"
          sx={{
            padding: "2%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack
            spacing={2}
            direction="row"
            sx={{ mt: 0, minHeight: "0px", border: "" }}
            alignItems="flex-start"
            justifyContent="space-between"
            width="100%"
            height="10%"
            className="top-left-side"
          >
            <div className="logo-landing-page">
              <img src={logo} alt="cw-logo" />
            </div>
            <Stack
              className="buttons-stack"
              spacing={2}
              direction="row"
              sx={{ mt: "0", minHeight: "0px", border: "" }}
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%"
            >
              <Button
                type="submit"
                size="small"
                color="primary"
                variant="text"
                sx={{
                  ...buttonStyle,
                  fontFamily: "Poppins, sans-serif", // Set font to Poppins
                  textTransform: "none", // Prevent text from being displayed in all caps
                  fontSize: "0.9rem", // Adjust font size as needed
                  fontWeight: "normal",
                }}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} size={24} />
                ) : (
                  "Blog"
                )}
              </Button>
              <Button
                type="submit"
                size="small"
                color="primary"
                variant="text"
                sx={{
                  ...buttonStyle,
                  fontFamily: "Poppins, sans-serif", // Set font to Poppins
                  textTransform: "none", // Prevent text from being displayed in all caps
                  fontSize: "0.9rem", // Adjust font size as needed
                  fontWeight: "normal",
                }}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} size={24} />
                ) : (
                  "Pricing"
                )}
              </Button>
              {/* <Link to="/login"> */}
              {/* <Button
                type="submit"
                size="small"
                color="primary"
                variant="text"
                sx={{ ...specialButtonStyle }}
                onClick={() => navigate("/signup")}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} size={24} />
                ) : (
                  "Sign Up"
                )}
              </Button> */}
              {/* </Link> */}
            </Stack>
          </Stack>
          <Stack
            spacing={3}
            direction="column"
            sx={{ ml: 2, marginTop: "5%", minHeight: "0px", border: "" }}
            alignItems="flex-start"
            justifyContent="center"
            width="100%"
            height="80%"
            className="text-left-landing"
          >
            <Typography
              sx={{
                mt: "0",
                fontFamily: "Poppins, sans-serif",
                ml: "1em",
                color: "#FF6F1A",
              }}
              component="h1"
              variant="h3"
            >
              Charting Cloud Resources
            </Typography>
            <Typography
              sx={{
                mt: "0",
                fontFamily: "Poppins, sans-serif",
                ml: "1em",
                color: "#273646",
              }}
              component="h3"
              variant="h4"
            >
              Precision Insights, Cost Reduction
            </Typography>
            <Typography
              sx={{
                mt: "0",
                ml: "1em",
                color: "#273646",
                fontFamily: "Poppins, sans-serif", // Adding Poppins font
                width: "70%",
              }}
              component="h4"
              variant="h6"
            >
              Elevate your cloud management with precise analytics through our
              inspector tool
            </Typography>
            {/* <Link to={isLoggedIn ? "/dashboard" : "/login"} style={linkStyles}> */}
            <Button
              type="submit"
              size="small"
              color="primary"
              variant="text"
              onClick={handleGetStarted}
              sx={{
                ...innerButtonStyle,
                fontFamily: "Poppins, sans-serif", // Setting font to Poppins
                textTransform: "none", // Preventing text from being displayed in all caps
              }}
            >
              {isLoading ? (
                <CircularProgress style={{ color: "white" }} size={24} />
              ) : (
                <>
                  Get Started
                  <EastIcon style={{ marginLeft: 4, fontSize: 16 }} />{" "}
                  {/* Adjust the fontSize value as per your requirement */}
                </>
              )}
            </Button>

            {/* </Link> */}
          </Stack>
          <FooterCopyright color="#fe6f1a" leftSpace="1.5%" />
        </Grid>
        <Grid
          item
          xs={5}
          className="grid-item-landing poster-container"
          sx={{
            paddingTop: "0px",
            flexDirection: "column",

            height: "100%",
          }}
        >
          <Carousel
            className="landing-carousel"
            navButtonsAlwaysInvisible={true}
            sx={{
              width: "80%", // Adjust width as needed
              height: "50%", // Adjust height as needed
              margin: "auto", // Center the carousel horizontally
              maxHeight: "100%",
              maxWidth: "60%",
            }}
          >
            {images.map((image, index) => (
              <>
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%", // Make the Paper component take up the entire height
                    backgroundColor: "white", // Set background color to white
                    borderRadius: "8px", // Add border-radius to create a slight curve effect
                    overflow: "hidden",
                    border: "5px solid #ffaa78", // Add orange border
                    boxSizing: "border-box", // Include padding and border in the element's total width and height
                  }}
                  key={index}
                >
                  <img
                    src={image}
                    alt={`slide-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                </Paper>

                <Typography
                  sx={{
                    mt: "8%", // Adjust margin-top to move the text further down
                    ml: "0",
                    color: "white",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif", // Adding Poppins font
                  }}
                  component="h4"
                  variant="subtitle1"
                >
                  {carouselTexts[index]}
                </Typography>
              </>
            ))}
          </Carousel>
        </Grid>
      </Grid>
    </div>
  );
}

export default NewLandingPage;
