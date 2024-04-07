import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "./LandingPage2.css";
import cardSection from "../../Assets/cardSection.png";
import { useLocation } from "react-router-dom";
import background1 from "../../Assets/landingPageBg1.png";
import dashboard from "../../Assets/dashboard.png";
import landingPageFeatures from "../../Assets/landingPageFeatures.png";
import successStories from "../../Assets/successStories.png";
import Navbar2 from "../Navbar2/Navbar2";
import FooterSection from "../FooterSection/FooterSection";
import NewButton from "../Button/NewButton";
// TODO remove, this demo shouldn't need to reset the theme.
function LandingPage2(props) {
  const { isLoggedIn } = props;
  const specialButtonStyle = {
    width: "30%",
    height: "40px",
    fontWeight: "normal", // Change fontWeight to normal
    textTransform: "none", // Prevent text from being displayed in all caps
    color: "#273646",
    fontFamily: "Poppins, sans-serif", // Set font to Poppins
    border: "1px solid #FF6F1A",
    "&:hover": {
      backgroundColor: "white",
      color: "#FF6F1A", // Change the text color on hover
    },
  };
  const isLoading = false;
  const navigate = useNavigate();
  const handleGetStarted = () => {
    // if (isLoggedIn) {
    //   navigate("/dashboard");
    // } else {
    navigate("/login");
    // }
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
          backgroundImage: `url(${background1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh", // Adjust height as needed
          display: "flex",
          justifyContent: "center",
        }}
        className="img-box"
      >
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingLeft: "5%",
          }}
        >
          {/* Left text */}
          <Box marginTop="1rem">
            <Typography
              variant="h3"
              style={{
                color: "transparent",
                backgroundImage: "linear-gradient(to right, #783406, #F46606)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                textAlign: "left",
                fontWeight: "bolder",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Optimize Your
              <br />
              Cloud, Effortlessly
            </Typography>
            <Typography
              variant="h5"
              fontFamily={"Poppins, sans-serif"}
              marginTop="1rem"
              color="#273646"
              fontWeight="bold"
            >
              Welcome to the Future of
              <br />
              Cloud Cost Management
            </Typography>
          </Box>
          <Box>
            <NewButton
              isLoading={isLoading}
              sx={{
                ...specialButtonStyle,
                backgroundColor: "#FF6F1A",
                color: "white",
                width: "30%",
                borderRadius: "0px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
              onClick={handleGetStarted}
              text="Get Started"
            />
          </Box>
          <Box>
            <Typography
              variant="h5"
              fontFamily={"Poppins, sans-serif"}
              color="#273646"
              fontWeight="bold"
            >
              Discover how{" "}
              <span style={{ color: "#FF6F1A" }}>Optiwave.cloud</span>{" "}
              revolutionizes
              <br />
              cloud cost optimization with cutting-edge
              <br />
              analytics and automation
            </Typography>
          </Box>
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Right image */}
          <img
            src={dashboard}
            alt="Second Image"
            style={{
              width: "80%",
              height: "70%",
              borderRadius: "1rem",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />{" "}
        </div>
      </Box>
      <Box
        sx={{
          marginTop: "4rem",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            marginTop: "",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "90%",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={"bolder"}
            fontFamily={"Poppins, sans-serif"}
            color="#273646"
            fontSize="1.2rem"
          >
            Why Optiwave.cloud?
          </Typography>
          <Typography
            variant="h3"
            style={{
              color: "transparent",
              backgroundImage: "linear-gradient(to right, #CB6E2F, #F46606)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              textAlign: "center",
              fontWeight: "bolder",
              fontFamily: "Poppins, sans-serif",
              marginTop: "1rem",
            }}
          >
            The Smart Choice for Cloud Savings
          </Typography>
          <Typography
            variant="p"
            fontFamily={"Poppins, sans-serif"}
            color="#273646"
            marginTop="2%"
          >
            Unveil the reasons behind Optiwave.cloud being the ultimate solution
            for your cloud financial management.
          </Typography>
          <Typography
            variant="p"
            fontFamily={"Poppins, sans-serif"}
            color="#273646"
            marginTop="3%"
          >
            Optiwave.cloud harnesses the power of intelligent analytics and
            automated optimization techniques to ensure your
          </Typography>
          <Typography
            variant="p"
            fontFamily={"Poppins, sans-serif"}
            color="#273646"
          >
            cloud spending is efficient, transparent, and under control. Ideal
            for businesses of all sizes, our platform adapts to
          </Typography>
          <Typography
            variant="p"
            fontFamily={"Poppins, sans-serif"}
            color="#273646"
          >
            your specific needs, offering unparalleled insights and savings.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "5rem",
        }}
      >
        <img src={cardSection} alt="Image" style={{ width: "90%" }} />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0",
        }}
      >
        <img src={landingPageFeatures} alt="Image" style={{ width: "90%" }} />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <img src={successStories} alt="Image" style={{ width: "80%" }} />
      </Box>
      <FooterSection />
    </div>
  );
}

export default LandingPage2;
