import { React, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logoWhiteBg from "../../Assets/optiwave_white_logo.png";
import NewButton from "../Button/NewButton";

export default function FooterSection(props) {
  const navigate = useNavigate();

  const specialButtonStyle2 = {
    width: "20%",
    fontWeight: "normal", // Change fontWeight to normal
    textTransform: "none", // Prevent text from being displayed in all caps
    color: "#273646",
    fontFamily: "Poppins, sans-serif", // Set font to Poppins
    "&:hover": {
      backgroundColor: "white",
    },
  };

  const textDecoratorUnderline = {
    "&:hover": {
      textDecoration: "underline",
    },
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box
      sx={{
        ...props,
        background: "#273646",
        width: "100%",
        minHeight: "500px", // Adjust height as needed
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        color: "white",
        fontFamily: "Poppins, sans-serif",
        fontSize: "1rem", // Adjust font size as needed
        textAlign: "center",
      }}
    >
      {/* Content of your footer */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          textAlign: "center",
          height: "400px",
          marginTop: "3rem",
        }}
      >
        <Typography
          variant="h5"
          fontFamily="Poppins, sans-serif"
          fontSize="1.2rem"
        >
          Start Saving Today
        </Typography>
        <Typography
          variant="h4"
          color="#FF6F1A"
          fontFamily="Poppins, sans-serif"
          fontWeight="bold"
        >
          Your Cloud Cost Optimization <br /> Journey Begins Here
        </Typography>
        <Typography
          variant="h5"
          fontFamily="Poppins, sans-serif"
          fontSize="1.2rem"
        >
          Take the first step towards smarter cloud <br /> spending with
          Optiwave.cloud
        </Typography>
        <NewButton
          sx={{
            ...specialButtonStyle2,
            textTransform: "none",
            background: "#ffffff",
            color: "#FF6F1A",
            width: "20%",
            borderRadius: "0px",
            height: "10%",
          }}
          onClick={() => navigate("/login")} //use signup
          isLoading={isLoading}
          text="Try it for free"
        />
        <Typography variant="body2" fontFamily="Poppins, sans-serif">
          Sign up for a free trial and experience firsthand how Optiwave.cloud
          can transform your cloud cost management. Our expert <br />
          team is here to guide you through each step, ensuring a smooth
          transition and immediate savings. Join the ranks of satisfied <br />
          customers achieving optimal cloud efficiency with Optiwave.cloud.
        </Typography>
      </Box>

      <Box width="90%" marginTop="2rem">
        <hr
          color="white"
          style={{
            height: "1px",
            border: "none",
            background: "#fff",
            opacity: 0.5,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "80%",
          marginTop: "5rem",
          marginBottom: "5rem",
        }}
      >
        <img
          src={logoWhiteBg}
          alt="Logo"
          style={{ height: 38, marginRight: "1rem" }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "2rem",
          }}
        >
          <Typography
            variant="h5"
            fontFamily="Poppins, sans-serif"
            fontWeight="bold"
          >
            Optimize Your Cloud, Effortlessly
          </Typography>
          <Typography variant="body2" fontFamily="Poppins, sans-serif">
            <Link
              to="/pricing"
              style={{
                ...textDecoratorUnderline,
                color: "white",
                marginRight: "1rem",
                textDecoration: "none",
              }}
            >
              Pricing
            </Link>
            <Link
              to="/contact-us"
              style={{ ...textDecoratorUnderline, color: "white" }}
            >
              Contact Us
            </Link>
          </Typography>
        </Box>
      </Box>
      <Box width="100%" sx={{}}>
        <hr
          color="black"
          style={{
            height: "1px",
            border: "none",
            background: "black",
            opacity: 0.3,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "80%",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Typography
          variant="body2"
          fontFamily="Poppins, sans-serif"
          mr={"2%"}
          fontSize="1.2rem"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          © Optiwave 2024
        </Typography>
        <Link
          to="/privacy-policy"
          style={{ textDecoration: "none", marginRight: "2%" }}
        >
          <Typography variant="body2" fontFamily="Poppins, sans-serif">
            Privacy Policy
          </Typography>
        </Link>
        <Link
          to="/help-center"
          style={{ textDecoration: "none", marginRight: "2%" }}
        >
          <Typography variant="body2" fontFamily="Poppins, sans-serif">
            Help Center
          </Typography>
        </Link>
        <Link to="/login" style={{ textDecoration: "none", marginRight: "2%" }}>
          <Typography variant="body2" fontFamily="Poppins, sans-serif">
            Login
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
