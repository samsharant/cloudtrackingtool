import React from 'react';
import { Container, Grid, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Container component="footer" sx={{ bgcolor: 'primary.main', color: 'common.white', py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">Company</Typography>
          <ul>
            <li>
              <Typography href="#">About Us</Typography>
            </li>
            <li>
              <Typography href="#">Capability</Typography>
            </li>
            <li>
              <Typography href="#">Blogs</Typography>
            </li>
            <li>
              <Typography href="#">Press Release</Typography>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">Industry</Typography>
          <ul>
            <li>
              <Typography href="#">Financial Services</Typography>
            </li>
            <li>
              <Typography href="#">EdTech</Typography>
            </li>
            <li>
              <Typography href="#">Pharma & Healthcare</Typography>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">Accelerators</Typography>
          <ul>
            <li>
              <Typography href="#">Drupal Audit</Typography>
            </li>
            <li>
              <Typography href="#">WebRTC</Typography>
            </li>
          </ul>
        </Grid>
      </Grid>
      {/* <Grid container  mt={4}>
        <IconButton href="#" color="inherit">
          <InstagramIcon />
        </IconButton>
        <IconButton href="#" color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton href="#" color="inherit">
          <LinkedInIcon />
        </IconButton>
        <IconButton href="#" color="inherit">
          <TwitterIcon />
        </IconButton>
      </Grid> */}
      <Typography variant="body2" align="center" mt={2}>
        ©2022 Companyname. All Rights Reserved
      </Typography>
    </Container>
  );
};

export default Footer;
