import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "./PricingPage.css";
import pricingBox3 from "../../Assets/pricingBox3.png";
import FooterSection from "../FooterSection/FooterSection";
import Navbar2 from "../Navbar2/Navbar2";
import { useLocation } from "react-router-dom";
// TODO remove, this demo shouldn't need to reset the theme.
function PricingPage(props) {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleClick = () => {
    navigate("/login"); //signup
  };

  return (
    <div className="landing-wrap">
      <Navbar2 />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            marginTop: "4rem",
            backgroundImage: `url(${pricingBox3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "500px",
            position: "relative", // Position relative for absolute positioning of header text
          }}
          className="background-box"
        >
          <Typography
            variant="h3"
            color="white"
            sx={{
              position: "absolute",
              top: "30px",
              fontFamily: "Poppins, sans-serif",
              fontSize: "2.2rem",
            }}
          >
            Start monitoring now. Pick your plan later.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "6.5rem",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "35%",
                margin: "0",
                background: "#fff",
                height: "350px !important",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "1.8rem",
                paddingBottom: "0",
              }}
            >
              {/* Content for left card */}
              <Typography
                variant="subtitle1"
                color="#FF6F1A"
                fontFamily="Poppins, sans-serif"
                fontWeight="bold"
                gutterBottom
              >
                Free
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                fontFamily="Poppins, sans-serif"
                fontWeight="bold"
                color="#273646"
                marginTop="0.8rem"
              >
                Standard Access
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginTop: "0.8rem",
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "0.7rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                • Full access to Optiwave.cloud platform
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "0.7rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                • Real time analytics and insights
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "0.7rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                • Multi-cloud support
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "0.7rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                • Comprehensive dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "0.7rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                • Proactive alerts
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                fontFamily="Poppins, sans-serif"
                fontWeight="light"
                color="#929aa2"
                marginTop="0.8rem"
                fontSize="0.73rem"
              >
                Enjoy unrestricted access to core features at no cost.
                <br /> Ideal for businesses of all sizes looking to optimize
                their <br />
                cloud spending.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                sx={{
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  fontFamily: "Poppins, sans-serif",
                  width: "33%",
                  backgroundColor: "#FF6F1A",
                  borderRadius: "0",
                  marginTop: "1rem",
                  "&:hover": { backgroundColor: "#FF6F1A" },
                }}
              >
                Get Started
              </Button>
            </Box>
            <Box
              sx={{
                width: "35%",
                margin: "0",
                background: "#fff",
                height: "350px !important",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "1.8rem",
                paddingBottom: "0",
              }}
            >
              {/* Content for left card */}
              <Typography
                variant="subtitle1"
                color="#FF6F1A"
                fontFamily="Poppins, sans-serif"
                fontWeight="bold"
                gutterBottom
              >
                Free for the first year
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                fontFamily="Poppins, sans-serif"
                fontWeight="bold"
                color="#273646"
                marginTop="0.8rem"
              >
                AI-ML Recommendations
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginTop: "0.8rem",
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "0.7rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                • All features in Standard Access
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "0.7rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                • Personalized AI-ML-driven cost optimization
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "1px",
                  fontSize: "0.9rem",
                  marginLeft: "1.3rem",
                  fontFamily: "Poppins, sans-serif",
                  color: "#273646",
                }}
              >
                recommendations
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                fontFamily="Poppins, sans-serif"
                fontWeight="light"
                color="#929aa2"
                marginTop="2.5rem"
                fontSize="0.73rem"
              >
                After the first year, a subscription fee applies for AI-ML{" "}
                <br />
                recommendations.
                <br />
                Pricing details for these advanced features will be provided{" "}
                <br />
                closer to the date.{" "}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                sx={{
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif",
                  width: "33%",
                  backgroundColor: "#FF6F1A",
                  borderRadius: "0",
                  marginTop: "1rem",
                  "&:hover": { backgroundColor: "#FF6F1A" },
                }}
              >
                Try Free
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <FooterSection marginTop="4rem" />
    </div>
  );
}

export default PricingPage;
