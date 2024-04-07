import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material'
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../../Assets/cw-logo.png";
import awsLogo from "../../Assets/awsLogo.png";
import googleCloudLogo from "../../Assets/googleCloudLogo.png";
import azureLogo from "../../Assets/azureLogo.png";
import selectStackCarousel1 from "../../Assets/selectStackCarousel1.png";
import selectStackCarousel2 from "../../Assets/selectStackCarousel2.png";
import selectStackCarousel3 from "../../Assets/selectStackCarousel3.png";
import FooterCopyright from "../FooterCopyright/FooterCopyright";
import EastIcon from "@mui/icons-material/East";
import "./SelectStackPage.css";
import NewButton from "../Button/NewButton";

// TODO remove, this demo shouldn't need to reset the theme.

function CloudOption({ image, label, onClick, additional, highlight }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // borderRadius: '5px !important',
        width: { xs: '100%', sm: '30%' },
        '&:hover .stack-logo': {
          border: '1px solid grey',
          boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
        },
      }}
      className="cloud-card"
      onClick={onClick}
    >
      <Box className="stack-logo" sx={{border: highlight ? '1px solid grey' : 'none',
      boxShadow: highlight ? '0px 3px 6px 0px rgba(0, 0, 0, 0.5)' : '0px 3px 6px 0px rgba(0, 0, 0, 0.2)'}}>
        <img src={image} alt="cloud-logo" height="100%" width="100%" />
      </Box>
      <Typography sx={{ ...additional, mt: 1, fontFamily: 'Poppins, sans-serif' }} variant="body1">
        {label}
      </Typography>
    </Box>
  );
}

function SelectStackPage(props) {
    const { setSelected } = props;
    const navigate = useNavigate();
    const handleRedirect = () => navigate('/login');

    console.log(props)
    const innerButtonStyle = {
      // padding: '5px',
      width: "20%",
      backgroundColor: "#FF6F1A",
      color: "white",
      border: "1px solid #FF6F1A",
      "&:hover": {
        backgroundColor: "#ffffff",
        color: "black", // Change the text color on hover
      },
    };
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



    const isLoading = false;
    const images = [ selectStackCarousel1, selectStackCarousel2, selectStackCarousel3 ];
  
    const [chosenOption, setChosenOption] = useState("");
    const [buttonDisabler, setButtonDisabler] = useState(true);
    const [clickHere, setClickHere] = useState(false);

    const buttonRef = useRef(null);
    const generateRandomChars = () => {
      // Function to generate a random 9-digit number
      return Math.floor(Math.random() * 1000000000).toString();
    };
    const VB_S3_TEMPLATE_URL = encodeURIComponent(
      'https://optiwave-template.s3.ap-south-1.amazonaws.com/optiwave-cur-v1.json'
    );
    const RANDOMCHARS = generateRandomChars();
    const STACK_NAME = `optiwave-template${RANDOMCHARS}`;
    const ROLE_NAME = `OptiwaveCrossAccountRole${RANDOMCHARS}`;
    const BUCKET_NAME = `optiwave-cur-report${RANDOMCHARS}`;
    const handleClick = () => {
      setSelected(false)
      const redirectUrl = `https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateURL=${VB_S3_TEMPLATE_URL}&stackName=${STACK_NAME}&param_ReportName=optiwave_cost_and_usage_report&param_RoleName=${ROLE_NAME}&param_BucketName=${BUCKET_NAME}&param_S3PrefixName=hourly`;
      setClickHere(true)
      // Redirect the user to the specified URL
      window.open(redirectUrl, '_blank');
  
      // Optionally, you can also open the URL in a new tab/window
      // window.open(redirectUrl, '_blank');
    };
    useEffect(() => {
        if (chosenOption == 'AWS') {
            setButtonDisabler(false);
            buttonRef.current.style.backgroundColor = '#FF6F1A';
            buttonRef.current.style.border = '1px solid #FF6F1A';
        } else {
            setButtonDisabler(true);
            buttonRef.current.style.backgroundColor = 'grey';
            buttonRef.current.style.border = '1px solid grey';
        }
    }, [chosenOption]);


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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '75%'
      }}
    >
      <Typography
        sx={{ mb: 2, color: '#273646', fontFamily: 'Poppins, sans-serif', marginLeft: '2rem' }}
        variant="body1"
        id="select-title"
      >
        Select Cloud Type:
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <CloudOption
          image={awsLogo}
          label="AWS"
          onClick={() => setChosenOption('AWS')}
          additional={{color: '#273646'}}
          highlight={chosenOption == 'AWS'}
        />
        <CloudOption
          image={googleCloudLogo}
          label="Google Cloud"
          onClick={() => setChosenOption('Google Cloud')}
          additional={{color: '#dedede'}}
          highlight={chosenOption == 'Google Cloud'}
        />
        <CloudOption
          image={azureLogo}
          label="Azure"
          onClick={() => setChosenOption('Azure')}
          additional={{color: '#dedede'}}
          highlight={chosenOption == 'Azure'}
        />
      </Box>

      <Button
              type="submit"
              size="small"
              color="primary"
              variant="text"
              disabled={chosenOption == ""}
              onClick={handleClick}
              ref={buttonRef}
              sx={{
                ...innerButtonStyle,
                fontFamily: "Poppins, sans-serif", // Setting font to Poppins
                textTransform: "none", // Preventing text from being displayed in all caps
                marginTop: '4rem',
                marginLeft: '1.25rem',
                width: '25%'
              }}
            >
              {isLoading ? (
                <CircularProgress style={{ color: "white" }} size={24} />
              ) : (
                <>
                  Create Stack
                  <EastIcon style={{ marginLeft: 4, fontSize: 16 }} />{" "}
                  {/* Adjust the fontSize value as per your requirement */}
                </>
              )}
            </Button>
    </Box>
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
    )
}

export default SelectStackPage;
