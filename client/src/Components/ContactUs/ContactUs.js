import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ContactUs.css";
import { useLocation } from "react-router-dom";
import contactUs from "../../Assets/contactUs.png";
import FooterSection from "../FooterSection/FooterSection";
import Navbar2 from "../Navbar2/Navbar2";
import FormTextfield from "../FormTextfield/FormTextfield";
import NewButton from "../Button/NewButton";
// TODO remove, this demo shouldn't need to reset the theme.
function ContactUs(props) {
  const { isLoggedIn } = props;

  const delay = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    newfield2: "",
    phone: "",
    companyName: "",
    comment: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.firstName) {
      errors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last Name is required";
    }

    if (!formData.newfield2) {
      errors.newfield2 = "Email Address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.newfield2)) {
        errors.newfield2 = "Invalid email format";
      }
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Invalid phone number";
      }
    }

    if (!formData.companyName) {
      errors.companyName = "Company Name is required";
    }

    if (!formData.comment) {
      errors.comment = "Your message is required";
    }

    return errors;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await delay(500);
    const formErrors = validateForm(formData);
    console.log(formData);
    console.log(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setFormData({
        firstName: "",
        lastName: "",
        newfield2: "",
        phone: "",
        companyName: "",
        comment: "",
      });
      setErrors({});
      toast.success("Your message has been submitted!");
      setIsLoading(false);
    } else {
      // There are validation errors, set them in state
      setErrors(formErrors);
      setIsLoading(false);
    }
  };

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="landing-wrap">
      <Navbar2 />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        {/* Left section with the form */}
        <Box sx={{ width: "40%", paddingLeft: "3rem" }}>
          {/* Form component */}
          <Typography
            variant="h4"
            style={{
              color: "transparent",
              backgroundImage: "linear-gradient(to right, #FF6F1A, #80370f)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              textAlign: "left",
              fontWeight: "bolder",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Hello !
          </Typography>
          <Typography
            variant="body2"
            fontFamily={"Poppins, sans-serif"}
            fontSize="1.1rem"
            marginTop="0.5rem"
            color="#273646"
            fontWeight="light"
          >
            Drop us a line and let's discuss the next steps.
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSignup}
            sx={{ mt: 2 }}
            className="contact-us-form"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormTextfield
                  fullWidth={false}
                  className="white-background"
                  autoComplete="off" // Disable autofill
                  name="firstName"
                  sx={{ width: "11rem" }}
                  id="firstName"
                  label="First Name"
                  onChange={handleChange}
                  value={formData.firstName}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                />

                <FormTextfield
                  fullWidth={false}
                  className="white-background"
                  sx={{ width: "11rem", ml: "1rem" }}
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="off" // Disable autofill
                  onChange={handleChange}
                  value={formData.lastName}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextfield
                  fullWidth={false}
                  className="white-background"
                  sx={{ width: "23rem" }}
                  id="email"
                  label="Work Email Address"
                  name="newfield2"
                  autoComplete="off" // Disable autofill
                  onChange={handleChange}
                  value={formData.newfield2}
                  error={Boolean(errors.newfield2)}
                  helperText={errors.newfield2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextfield
                  fullWidth={false}
                  className="white-background"
                  sx={{ width: "23rem" }}
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  id="phone"
                  onChange={handleChange}
                  value={formData.phone}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
                <Grid item xs={12}>
                  <FormTextfield
                    fullWidth={false}
                    className="white-background"
                    name="companyName"
                    label="Company"
                    type="text"
                    autoComplete="off" // Disable autofill
                    id="companyName"
                    sx={{ mt: 2, width: "23rem" }} // Add margin here
                    onChange={handleChange}
                    value={formData.companyName}
                    error={Boolean(errors.companyName)}
                    helperText={errors.companyName}
                  />
                </Grid>
                <Grid item xs={12} className="textarea">
                  <FormTextfield
                    size="large"
                    fullWidth={false}
                    className="white-background"
                    name="comment"
                    label="Do you want to say anything?"
                    type="text"
                    autoComplete="off" // Disable autofill
                    id="companyName"
                    sx={{ mt: 2, width: "23rem" }} // Add margin here
                    onChange={handleChange}
                    value={formData.comment}
                    error={Boolean(errors.comment)}
                    helperText={errors.comment}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Box sx={{ display: "flex" }}>
                    <NewButton
                      sx={{
                        background: "#FF6F1A",
                        color: "#FFF",
                        borderRadius: 0,
                        textTransform: "none",
                        fontFamily: "Poppins, sans-serif",
                        width: "8rem",
                        "&:hover": {
                          background: "#FF6F1A",
                        },
                        flexShrink: 0,
                      }}
                      text="Send Now"
                      isLoading={isLoading}
                    />
                    <Button
                      sx={{
                        background: "white",
                        marginLeft: "1rem",
                        color: "grey",
                        borderRadius: 0,
                        border: "1px solid grey",
                        textTransform: "none",
                        fontFamily: "Poppins, sans-serif",
                        boxShadow: "none",
                        width: "14rem",
                        // maxWidth: 'none',
                        "&:hover": {
                          background: "white",
                        },
                        flexShrink: 0,
                      }}
                    >
                      Schedule a meeting
                    </Button>
                  </Box>
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
                      
                      value={formData.companyDomain}
                      onChange={handleInputChange}
                      error={Boolean(errors.companyDomain)}
                      helperText={errors.companyDomain}
                    />
                  </Grid> */}
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Right section with the image */}
        <Box sx={{ width: "50%" }}>
          {/* Image component */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: "0rem",
            }}
          >
            {/* Right image */}
            <img
              src={contactUs}
              alt="Second Image"
              style={{
                width: "80%",
                height: "70%",
                borderRadius: "1rem",
                boxShadow: "none",
              }}
            />
          </div>
        </Box>
      </Box>
      <FooterSection marginTop="4rem" />
    </div>
  );
}

export default ContactUs;
