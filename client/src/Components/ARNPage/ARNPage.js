import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Input, InputLabel, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import FooterCopyright from "../FooterCopyright/FooterCopyright";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useActions } from "../../Utils";

import {
  isLoggedInSelector,
  nextPageSelector,
} from "../../redux/_selectors/identityManagementSelector";

import { useSelector } from "react-redux";
import { Link as RedirectTo } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../../Assets/cw-logo.png";
import selectStackCarousel1 from "../../Assets/selectStackCarousel1.png";
import selectStackCarousel2 from "../../Assets/selectStackCarousel2.png";
import selectStackCarousel3 from "../../Assets/selectStackCarousel3.png";
import "./ARNPage.css";
import { identityManagement } from "../../redux/_actions/identityManagement";
import FormTextfield from "../FormTextfield/FormTextfield";
import NewButton from "../Button/NewButton";
// TODO remove, this demo shouldn't need to reset the theme.
function ARNPage(props) {
  const { isLoggedIn } = props;
  const specialButtonStyle = {
    width: "20%",
    fontFamily: 'Poppins, sans-serif',
    fontWeight: "200",
    color: "#273646",
    border: "1px solid #FF6F1A",
    "&:hover": {
      backgroundColor: "#FF6F1A",
      color: 'white',
    },
  };
  const disabledButtonStyle = {
    display: "block",
    height: "35%",
    width: "30%",
    fontWeight: "200",
    backgroundColor: "grey",
    color: "white",
    border: "1px solid grey",
  };
  const [identity] = useActions([identityManagement]);
  const user = useSelector(isLoggedInSelector);
  const nextPage = useSelector(nextPageSelector);
  let navigate = useNavigate();
  const handleRedirect = () => navigate('/login');
  const sessionToken = localStorage.getItem("authToken");

  const isLoading = false;
  const images = [
    selectStackCarousel1,
    selectStackCarousel2,
    selectStackCarousel3,
  ];
  const [arnInput, setArnInput] = useState("");
  const [buttonDisabler, setButtonDisabler] = useState(true);
  const buttonRef = useRef(null);

  const checkArnMatches = (inputString) => {
    const regex = /^arn:aws:iam::\d{12}:role\/OptiwaveCrossAccountRole\d{9}$/;

    return regex.test(inputString);
  };
  const dispatch = useDispatch();

  const handleInput = (e) => {
    setArnInput(e.target.value);
  };
  const handleSubmit = async (e) => {
    // console.log(e.target.value)
    console.log('Input value:', arnInput);

    // if (!selectedService.trim()) {
    //   setError("Cloud Type cannot be empty");
    //   return;
    // }
    // if (selectedService !== "AWS") {
    //   setError(`${selectedService} is not available. Only AWS is supported.`);
    //   return;
    // }

    // Check for empty Access Key and Secret Key
    // if (!accessKey.trim() || !secretKey.trim()) {
    //   setError("Access Key and Secret Key are required.");
    //   return;
    // }
    const response = await dispatch(
      identityManagement({
        selectedService: "AWS",
        sessionToken,
        arnInput,
      })
    );
    if (response) {
      console.log(response)
      console.log(user)
      console.log(nextPage);

      // const { nextPage } = sessionToken;
      // const { Logout } = sessionToken;
      // isloggedin(true);
      // updateLogin(true);
      // navigate("/dashboard");
    } else {
      // Handle signup failure (e.g., display error message)
    }
  };
  console.log(user)
  if (user) {
    console.log(user);
    console.log(nextPage);
    if (nextPage === "/dashboard") {
      navigate(nextPage);
    }
  }
  useEffect(() => {
    if (checkArnMatches(arnInput)) {
      setButtonDisabler(false);
      buttonRef.current.style.backgroundColor = "#FF6F1A";
      buttonRef.current.style.border = "1px solid #FF6F1A";
      buttonRef.current.onmouseover = () => {
        buttonRef.current.style.color = "black";
      };
      buttonRef.current.onmouseout = () => {
        buttonRef.current.style.color = ""; // Revert back to default color
      };
    } else {
      setButtonDisabler(true);
      buttonRef.current.style.backgroundColor = "grey";
      buttonRef.current.style.border = "1px solid grey";
      buttonRef.current.onmouseover = null; // Remove the hover effect
      buttonRef.current.onmouseout = null; // Remove the hover effect
    }
  }, [arnInput]);

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
          xs={6}
          className="grid-item-landing"
          sx={{
            padding: "2%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="95%"
          height="auto"
        >
          <img
            src={logo}
            alt="cw-logo"
            style={{ height: 80 }}
          />
          <NewButton
            sx={{ ...specialButtonStyle, textTransform: 'none', width:"15%" }}
            onClick={handleRedirect} // Make the button a link
            isLoading={isLoading}
            text="Login"
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left"
          justifyContent="flex-start"
          padding={2}
        >
          <Typography variant="h6" gutterBottom color="#273646" fontWeight="bold">
            Input Token Code
          </Typography>
          <Typography variant="body1" paragraph color="#A5A1A0" marginTop="1rem">
            When you followed the steps for creating stack from AWS, you <br/> will be
            received a token code
          </Typography>
          <Typography variant="body1" color="#A5A1A0" marginTop="1rem">
            Please apply the token in the below input field:
          </Typography>
        </Box>
        <div className="arn-textfield" style={{paddingLeft: '0', marginTop: '1rem'}}>
              <InputLabel
                sx={{ ml: 1, mb: 1, textAlign: "left", fontWeight: "", fontFamily: 'Poppins, sans-serif' }}
              >
                ARN
              </InputLabel>
              <FormTextfield
                autoComplete="given-name"
                name="secretkey"
                id="secretkey"
                autoFocus
                onChange={handleInput}
                sx={{
                  marginTop: "0%",
                  borderRadius: "7px",
                  border: "1px solid #FF6F1A",
                  background: "#FFF6F0",
                  width: "65%",
                }}
              />
              <Button
                type="submit"
                size="small"
                color="primary"
                variant="text"
                sx={{ ...disabledButtonStyle, marginTop: "3rem", textTransform: 'none', width: '20%', fontFamily: 'Poppins, sans-serif', fontWeight: '200' }}
                id="arn-submit-btn"
                // disabled={buttonDisabler}
                onClick={handleSubmit}
                ref={buttonRef}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} size={24} />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          <FooterCopyright color="#fe6f1a" leftSpace="1.5%" />
        </Grid>
        <Grid
          item
          xs={6}
          className="grid-item-landing poster-container"
          sx={{
            paddingTop: "1%",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Carousel
            className="landing-carousel-2"
            navButtonsAlwaysInvisible={true}
            sx={{
              width: "80%", // Adjust width as needed
              height: "78%", // Adjust height as needed
              margin: "auto", // Center the carousel horizontally
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
                overflow: "hidden",
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
                }}
              />
            </Paper>

                <Typography
                  sx={{
                    mt: "2%", // Adjust margin-top to move the text further down
                    ml: "0",
                    color: "white",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif", // Adding Poppins font
                  }}
                  component="h4"
                  variant="h4"
                >
                  Enhance Cloud Governance:
                </Typography>
                <Typography
                  sx={{
                    mt: "2%", // Adjust margin-top to move the text further down
                    ml: "0",
                    color: "#273646",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif", // Adding Poppins font
                  }}
                  component="h5"
                  variant="h5"
                >
                  Secure Credentials and
                </Typography>
                <Typography
                  sx={{
                    mt: "4%", // Adjust margin-top to move the text further down
                    ml: "0",
                    mb: "4%",
                    color: "#273646",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif", // Adding Poppins font
                    fontSize: '1rem'
                  }}
                  component="h5"
                  variant="h5"
                >
                  Role-Based Access Control, Empowering Organizations<br/> to Manage Users and Optimize Resources
                </Typography>
              </>
            ))}
          </Carousel>
        </Grid>
      </Grid>
    </div>
  );
}

export default ARNPage;
