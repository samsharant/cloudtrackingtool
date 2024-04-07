import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link as RedirectTo } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Copyright from "../Copyright.js/Copyright";
import Footer from "../Footer/Footer";
import logo from "../../Assets/cw-logo.png";
import poster1 from "../../Assets/cw-about-us.png";
import "./AboutUs.css";
import { useActions } from "../../Utils";
import { login as loginAction } from "../../redux/_actions/authActions";
// TODO remove, this demo shouldn't need to reset the theme.
import {
  isLoggedInSelector,
  nextPageSelector,
} from "../../redux/_selectors/authSelector";

function AboutUsPage({ updateLogin }) {
  const dispatch = useDispatch();
  const [login] = useActions([loginAction]);
  const user = useSelector(isLoggedInSelector);
  const nextPage = useSelector(nextPageSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
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
    const formErrors = {};
    if (!formData.email) {
      formErrors.email = "Email is required";
    }
    if (!formData.password) {
      formErrors.password = "Password is required";
    }
    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true); // Set loading to true
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");
      const response = await login({ email, password });
      console.log(response);
      if (response) {
        console.log(user);
        setIsLoading(false);
      } else {
        // Handle signup failure (e.g., display error message)
      }
      // Reset loading to false after signup is complete
    } else {
      // There are validation errors, set them in state
      setErrors(formErrors);
    }
  };
  console.log(user);
  if (user) {
    console.log(user);
    if (nextPage == "/verify-user") {
      navigate(nextPage);
      localStorage.clear();
    } else {
      updateLogin(user);
      navigate(nextPage);
    }
  }
  // if(nextPage=='/identity-management'){
  //   // updateLogin(user);
  //     navigate(nextPage);
  // }
  // if(nextPage=='/verify-user'){
  //     navigate(nextPage);
  // }
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
    fontWeight: "bold",
    border: "solid 1px #e6923a",
    "&:hover": {
      backgroundColor: "#e6923a", // Change the background color on hover
      color: "#ffffff", // Change the text color on hover
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="aboutUs-page-container">
        <Container className="poster1-page" component="main" maxWidth="xs">
          <div className="poster1-div">
            <img
              src={poster1}
              alt="cw-logo"
              className={`poster1-image ${isPosterLoaded ? "loaded" : ""}`}
              onLoad={handlePosterLoad}
            />
          </div>
          <h1>
            <span>A cloud monitoring tool </span> that monitors multiple
          </h1>
          <div className="about-tool-content">
            cloud accounts and uses AI to optimize costs.
          </div>
        </Container>
        <Container className="container-page" component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <div className="logoLogin-div">
              <img src={logo} alt="cw-logo" />
            </div>{" "} */}
            <h1>
              <Typography
                sx={{ color: "#e6923a", fontWeight: "bold" }}
                component="h1"
                variant="h4"
              >
                About Us{" "}
              </Typography>
            </h1>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Typography
                sx={{ mt: "5px", fontWeight: "bold" }}
                component="h1"
                variant="subtitle1"
              >
                Simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has
              </Typography>
              <Typography
                sx={{ mt: "5px", fontWeight: "bold" }}
                component="h1"
                variant="subtitle1"
              >
                Simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has
              </Typography>
              <Typography
                sx={{ mt: "5px", fontWeight: "bold" }}
                component="h1"
                variant="subtitle1"
              >
                Simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has
              </Typography>
              <Typography
                sx={{ mt: "5px", fontWeight: "bold" }}
                component="h1"
                variant="subtitle1"
              >
                Simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has
              </Typography>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  size="small"
                  color="primary"
                  variant="text"
                  sx={buttonStyle}
                >
                 Click here to Begin
                </Button>
              </div>
            </Box>
          </Box>
        </Container>
        {/* <Footer className="copyright" sx={{ mb: 5 }} /> */}
      </div>
    </ThemeProvider>
  );
}

export default AboutUsPage;
