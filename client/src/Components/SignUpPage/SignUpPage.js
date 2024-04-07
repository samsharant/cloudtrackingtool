import React, { useState, useRef, useEffect } from "react";
import { CssBaseline, Grid, Box, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { signup } from "../../store/actions/authActions";
import { signup as signupAction } from "../../redux/_actions/signupActions";
import { useActions } from "../../Utils";
import {
  isLoggedInSelector,
  nextPageSelector,
} from "../../redux/_selectors/signupSelector";
import "./SignUpPage.css";
import logo from "../../Assets/cw-logo.png";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import laptopPoster from "../../Assets/cw-laptopPoster.png";
import FooterCopyright from "../FooterCopyright/FooterCopyright";
import { useSelector } from "react-redux";
import FormTextfield from "../FormTextfield/FormTextfield";
import NewButton from "../Button/NewButton";

function validateForm(formData) {
  const errors = {};

  if (!formData.firstName) {
    errors.firstName = "First Name is required";
  }

  if (!formData.lastName) {
    errors.lastName = "Last Name is required";
  }

  if (!formData.newfield2) {
    errors.email = "Email Address is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.newfield2)) {
      errors.email = "Invalid email format";
    }
  }

  if (!formData.newfield) {
    errors.password = "Password is required";
  } else {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(formData.newfield)) {
      errors.password =
        "Password must contain at least one uppercase letter, one number, and one special character";
    }
  }

  if (!formData.companyName) {
    errors.companyName = "Company Name is required";
  }

  // if (!formData.companyDomain) {
  //   errors.companyDomain = "Company Domain is required";
  // }

  return errors;
}

export default function SignUpPage({ updateLogin }) {
  let navigate = useNavigate();
  const user = useSelector(isLoggedInSelector);
  const nextPage = useSelector(nextPageSelector);
  const [signup] = useActions([signupAction]);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState(1);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
    companyDomain: "",
  });
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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
  const handleSignup = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true
    const formErrors = validateForm(formData);
    console.log(formData);
    console.log(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("right");

      const {
        firstName,
        lastName,
        newfield2,
        newfield,
        companyName,
        companyDomain,
      } = formData;
      const data = new FormData(event.currentTarget);
      const email = data.get("newfield2");
      const password = data.get("newfield");
      // if (email.split("@")[1] !== companyDomain) {
      //   toast.error("Email must be of company Domain");
      //   setIsLoading(false);
      //   return;
      // }
      const userName = `${firstName} ${lastName}`;
      const response = await signup({
        companyName,
        companyDomain: "https://www.valuebound.com/",
        userName,
        email,
        password,
      });

      console.log(response);
      // if (response) {
      //   navigate("/identity-management");
      // } else {
      //   // Handle signup failure (e.g., display error message)
      // }
    } else {
      console.log("wrong");

      // There are validation errors, set them in state
      setErrors(formErrors);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  if (user) {
    updateLogin(user);
    navigate(nextPage);
  }
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
    fontFamily: "Poppins, sans-serif", // Set font to Poppins
    border: "1px solid #FF6F1A",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#FF6F1A", // Change the text color on hover
    },
  };

  const loginContainerRef = useRef(null);

  useEffect(() => {
    if (openConfirm) {
      loginContainerRef.current.style.opacity = 0.1;
    }
  }, [openConfirm]);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

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

  return (
    <ThemeProvider theme={theme}>
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
            <NewButton
              sx={{ ...containerButtonStyle, textTransform: "none" }} // Add textTransform: 'none' to prevent all caps
              onClick={() => navigate("/login")}
              text="Login"
            />
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
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                onClick={() => navigate("/login")}
                label="Login"
                {...a11yProps(0)}
              />
              <Tab
                onClick={() => navigate("/signup")}
                label="Sign Up"
                {...a11yProps(1)}
              />
              <Tab
                onClick={() => navigate("/login")}
                label="Guest"
                {...a11yProps(3)}
              />
            </Tabs>
            <Box
              component="form"
              noValidate
              onSubmit={handleSignup}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormTextfield
                    className="white-background"
                    autoComplete="off" // Disable autofill
                    name="firstName"
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextfield
                    className="white-background"
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="off" // Disable autofill
                    autoFocus
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextfield
                    className="white-background"
                    id="email"
                    label="Business Email"
                    name="newfield2"
                    autoComplete="off" // Disable autofill
                    autoFocus
                    value={formData.newfield2}
                    onChange={handleInputChange}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextfield
                    className="white-background"
                    name="newfield"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password" // Change to "new-password"
                    autoFocus
                    value={formData.newfield}
                    onChange={handleInputChange}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    showPassword={showPassword}
                    handleTogglePasswordVisibility={
                      handleTogglePasswordVisibility
                    }
                  />
                  <Grid item xs={12}>
                    <FormTextfield
                      className="white-background"
                      name="companyName"
                      label="Company Name"
                      type="text"
                      autoComplete="off" // Disable autofill
                      id="companyName"
                      sx={{ mt: 2 }} // Add margin here
                      autoFocus
                      value={formData.companyName}
                      onChange={handleInputChange}
                      error={Boolean(errors.companyName)}
                      helperText={errors.companyName}
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <TextField
                      size="small"
                      className="white-background"
                      fullWidth
                      name="companyDomain"
                      autoComplete="off" // Disable autofill
                      label="Company Domain"
                      type="text"
                      id="companyDomain"
                      sx={{ mt: 2 }} // Add margin here
                      autoFocus
                      value={formData.companyDomain}
                      onChange={handleInputChange}
                      error={Boolean(errors.companyDomain)}
                      helperText={errors.companyDomain}
                    />
                  </Grid> */}
                </Grid>
              </Grid>

              <div style={{ display: "flex", justifyContent: "start" }}>
                <NewButton
                  sx={{ ...buttonStyle, textTransform: "none", width: "25%" }} // Add textTransform: 'none' to prevent all caps
                  isLoading={isLoading}
                  text="Sign Up"
                />
              </div>
            </Box>
            <FooterCopyright color="#fe6f1a" leftSpace="0% !important" />
          </Box>
        </Container>
        {/* Wrap the content in a container */}
        <Container className="poster-page" component="main">
          <div className="poster-content">
            <div className="logoSignup-div" id="poster-div-sign-up">
              <img
                src={laptopPoster}
                alt="cw-logo"
                // className={`poster-image ${isPosterLoaded ? "loaded" : ""}`}
                onLoad={handlePosterLoad}
              />
            </div>
            <div className="sposter-text" id="poster-text-sign-up">
              <Typography
                sx={{
                  mt: "0",
                  ml: "20%",
                  width: "60%",
                  color: "#273646",
                  fontFamily: "Poppins, sans-serif",
                }}
                component="h3"
                variant="h4"
              >
                Revolutionize AWS Cloud Management:
              </Typography>
              <Typography
                sx={{
                  mt: "0.5em",
                  color: "white",
                  ml: "20%",
                  fontFamily: "Poppins, sans-serif",
                }}
                component="h3"
                variant="h4"
              >
                Dynamic Dashboards, Graphs,
              </Typography>
              <Typography
                sx={{
                  mt: "0.5em",
                  color: "white",
                  ml: "20%",
                  width: "70%",
                  fontFamily: "Poppins, sans-serif",
                }}
                component="h5"
                variant="h6"
              >
                and Pie Charts for Real-time Insights, Cost Efficiency, and
                Strategic Optimization.
              </Typography>
            </div>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}
