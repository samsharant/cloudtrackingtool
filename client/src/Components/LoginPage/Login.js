import React, { useRef, useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import { login as loginAction } from "../../redux/_actions/authActions";
import { signup as signupAction } from "../../redux/_actions/signupActions";
import SignupConfirmation from "../SignupConfirmation/SignupConfirmation";
import { useActions } from "../../Utils";

import {
  isLoggedInSelector,
  nextPageSelector,
} from "../../redux/_selectors/authSelector";

import { useSelector } from "react-redux";

import logo from "../../Assets/cw-logo.png";
import loginCostBreakup from "../../Assets/loginCostBreakup.PNG";
import loginTotalCost from "../../Assets/loginTotalCost.PNG";
import loginTagCost from "../../Assets/loginTagged.png";
import loginUntagCost from "../../Assets/loginUntaagged.png";
import "./Login.css";
import FooterCopyright from "../FooterCopyright/FooterCopyright";
import FormTextfield from "../FormTextfield/FormTextfield";
import NewButton from "../Button/NewButton";

// TODO remove, this demo shouldn't need to reset the theme.
function validateForm(formData) {
  const errors = {};

  if (!formData.newfield2) {
    errors.newfield2 = "Email Address is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.newfield2)) {
      errors.newfield2 = "Invalid email format";
    }
  }

  if (!formData.newfield) {
    errors.newfield = "Password is required";
  } else {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(formData.newfield)) {
      errors.newfield =
        "Password must contain at least one uppercase letter, one number, and one special character";
    }
  }

  return errors;
}
function Login({ updateLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    newfield2: "",
    newfield: "",
  });
  const [login] = useActions([loginAction]);
  const [signup] = useActions([signupAction]);
  const [showPassword, setShowPassword] = useState(false);

  const user = useSelector(isLoggedInSelector);
  const nextPage = useSelector(nextPageSelector);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const targetDiv = document.querySelector(".Toastify");

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          targetDiv.innerHTML.trim() !== ""
        ) {
          setIsLoading(false);
        }
      }
    });

    observer.observe(targetDiv, { childList: true });

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, []); // Empty dependency array to run this effect only once
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handlePosterLoad = () => {
    setIsPosterLoaded(true);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (value === 1) {
      navigate("/dashboard");
      return;
    }
    console.log(formData);
    const formErrors = validateForm(formData);
    if (!formData.newfield2) {
      formErrors.newfield2 = "Email is required";
    }
    if (!formData.newfield) {
      formErrors.newfield = "Password is required";
    }
    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true); // Set loading to true
      const data = new FormData(event.currentTarget);
      const email = data.get("newfield2");
      const password = data.get("newfield");
      const response = await login({ email, password });
      console.log(response);
      if (response) {
        console.log(user);
      } else {
        // Handle signup failure (e.g., display error message)
      }
      // Reset loading to false after signup is complete
    } else {
      // There are validation errors, set them in state
      setErrors(formErrors);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  // console.log(user);
  // console.log(user);

  //   if (user) {
  //     if (nextPage == "/verify-user") {
  //       navigate(nextPage);
  //       localStorage.clear();
  //     } else {
  //       updateLogin(user);
  //       navigate(nextPage);
  //     }
  //   }

  const theme = createTheme({
    palette: {
      primary: {
        main: "#e6923a",
      },
    },
  });
  const buttonStyle = {
    mt: 3,
    mb: 2,
    width: "50%",
    backgroundColor: "#FF6F1A",
    color: "#ffffff",
    fontFamily: "Poppins, sans-serif", // Set font to Poppins,
    fontWeight: 200,
    border: "1px solid #FF6F1A",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#FF6F1A", // Change the text color on hover
    },
  };
  const containerButtonStyle = {
    mt: 3,
    mb: 2,
    mr: 4,
    width: "21%",
    height: "20%",
    backgroundColor: "#ffffff",
    color: "#273646",
    border: "1px solid #FF6F1A",
    fontFamily: "Poppins, sans-serif", // Set font to Poppins,
    fontWeight: 200,
    "&:hover": {
      backgroundColor: "#FF6F1A",
      color: "#ffffff", // Change the text color on hover
    },
  };

  const [value, setValue] = useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setLoginShow(!loginShow);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const [loginShow, setLoginShow] = useState(0);

  const loginContainerRef = useRef(null);

  useEffect(() => {
    if (openConfirm) {
      loginContainerRef.current.style.opacity = 0.1;
    }
  }, [openConfirm]);
  return (
    <ThemeProvider theme={theme}>
      {
        <div className="login-page-container" ref={loginContainerRef}>
          <Container className="container-page" component="main">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 2,
                marginLeft: 7,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div className="logoLogin-div">
                <img
                  src={logo}
                  alt="cw-logo"
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                />
              </div>{" "}
              {/* <NewButton
                sx={{ ...containerButtonStyle, textTransform: "none" }} // Add textTransform: 'none' to prevent all caps
                onClick={() => navigate("/signup")}
                text="Sign Up"
              /> */}
            </Box>
            <Box
              sx={{
                marginTop: 5,
                marginLeft: 7,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  onClick={() => navigate("/login")}
                  label="Login"
                  {...a11yProps(0)}
                />
                {/* <Tab
                  onClick={() => navigate("/signup")}
                  label="Sign Up"
                  {...a11yProps(1)}
                />{" "} */}
                <Tab
                  onClick={() => navigate("/login")}
                  label="Guest"
                  {...a11yProps(2)}
                />
              </Tabs>
              <Box
                component="form"
                noValidate
                sx={{ mt: 3 }}
                onSubmit={handleSubmit}
              >
                {value === 0 && (
                  <>
                    <FormTextfield
                      id="email"
                      label="Email Address"
                      className="white-background"
                      name="newfield2"
                      autoFocus
                      autoComplete="off" // Disable autofill
                      sx={{ mt: 2 }} // Add margin here
                      value={formData.newfield2}
                      onChange={handleInputChange}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                    />
                    <FormTextfield
                      name="newfield"
                      label="Password"
                      className="white-background"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      sx={{ mt: 2 }}
                      autoComplete="new-password" // Change to "new-password"
                      value={formData.newfield}
                      onChange={handleInputChange}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                      showPassword={showPassword}
                      handleTogglePasswordVisibility={
                        handleTogglePasswordVisibility
                      }
                    />
                  </>
                )}
                <div style={{ display: "flex", justifyContent: "start" }}>
                  <NewButton
                    sx={{
                      ...buttonStyle,
                      textTransform: "none",
                      width: value === 0 ? "25%" : "250px",
                    }} // Add textTransform: 'none' to prevent all caps
                    text={value === 0 ? "Login" : "Guest Login"}
                    isLoading={isLoading}
                  />
                </div>
              </Box>
              <FooterCopyright color="#fe6f1a" leftSpace="0%" />
            </Box>
          </Container>
          <Container className="poster-page" component="main">
            {/* <div className="poster-div-login">
              <div className="poster-div-login-row-1" >
                <img
                  src={loginCostBreakup}
                  alt="cost-breakup"
                  style={{ borderRadius: '6px' }}
                  // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                  onLoad={handlePosterLoad}
                />
              </div>
              <div className="poster-div-login-row-2">
                <img
                  src={loginTotalCost}
                  alt="cost-breakup"
                  style={{ borderRadius: '4px' }}
                  // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                  onLoad={handlePosterLoad}
                />
              </div>
              <div className="poster-div-login-row-3">
                <img
                  src={loginTagCost}
                  alt="cost-breakup"
                  // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                  onLoad={handlePosterLoad}
                />
              </div>
              <div className="poster-div-login-row-4">
                <img
                  src={loginUntagCost}
                  alt="cost-breakup"
                  // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                  onLoad={handlePosterLoad}
                />
              </div>
            </div> */}
            <div className="poster-div-login">
              <div className="poster-div-login-column-1">
                <div className="poster-div-login-row-1">
                  <img
                    src={loginCostBreakup}
                    alt="cost-breakup"
                    style={{ borderRadius: "6px" }}
                    // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                    onLoad={handlePosterLoad}
                  />{" "}
                </div>
              </div>
              <div className="poster-div-login-column-2">
                <div className="poster-div-login-row-2">
                  <img
                    src={loginTotalCost}
                    alt="cost-breakup"
                    style={{ borderRadius: "4px" }}
                    // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                    onLoad={handlePosterLoad}
                  />{" "}
                </div>
                <div className="poster-div-login-row-3">
                  <img
                    src={loginTagCost}
                    alt="cost-breakup"
                    // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                    onLoad={handlePosterLoad}
                  />{" "}
                </div>
                <div className="poster-div-login-row-4">
                  <img
                    src={loginUntagCost}
                    alt="cost-breakup"
                    // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                    onLoad={handlePosterLoad}
                  />{" "}
                </div>
              </div>
            </div>

            <div className="poster-text">
              <Typography
                sx={{
                  mt: "0",
                  ml: "2em",
                  color: "#273646",
                  fontFamily: "Poppins, sans-serif",
                }}
                component="h3"
                variant="h4"
              >
                Master your AWS Cloud:
              </Typography>
              <Typography
                sx={{
                  mt: "0.5em",
                  ml: "2em",
                  color: "white",
                  fontFamily: "Poppins, sans-serif",
                }}
                component="h3"
                variant="h4"
              >
                Unleash Comprehensive,
              </Typography>
              <Typography
                sx={{
                  mt: ".5em",
                  ml: "3.5em",
                  color: "white",
                  fontFamily: "Poppins, sans-serif", // Adding Poppins font
                  width: "80%",
                }}
                component="h5"
                variant="h6"
              >
                Service Insights, Cost Control, and Strategic Optimization with
                Our Dynamic Dashboard.
              </Typography>
            </div>
          </Container>
          {/* <Copyright
            className="copyright"
            sx={{ mb: 5, textAlign: "left", ml: 5 }}
          /> */}
          {openConfirm ? <SignupConfirmation open={openConfirm} /> : ""}
        </div>
      }
    </ThemeProvider>
  );
}

export default Login;
