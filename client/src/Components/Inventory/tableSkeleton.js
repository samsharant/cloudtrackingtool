import { Box, Skeleton, Typography } from "@mui/material";
import "./tableSkeleton.css"; // Import your CSS file for custom styles
import logo from "../../Assets/cw-loadingInventory.png";
import logo2 from "../../Assets/cw-loadingInventorySecondary.png";

export function renderTableSkeleton() {
  return (
    <Box
      sx={{ width: "100%", marginTop: "20px" }}
      className="skeleton-container"
    >
      <Skeleton variant="rectangular" height={300} />
      {/* <Skeleton animation="wave" height={50} />
      <Skeleton animation={false} height={50} />
      <Skeleton animation="wave" height={50} />
      <Skeleton animation={false} height={50} />
      <Skeleton animation="wave" height={50} />
      <Skeleton animation={false} height={50} />
      <Skeleton animation="wave" height={50} />
      <Skeleton animation={false} height={50} />
      <Skeleton animation="wave" /> */}

      {/* Add the SVG search icon here */}
      {/* <SearchIcon fontSize="large" className="circular-icon" /> */}
      <div className="logoCircular-div">
        <img src={logo2} alt="cw-logo" className="circularSecondary-icon" />
        <img src={logo} alt="cw-logo" className="circular-icon" />
        <img src={logo2} alt="cw-logo" className="circularThird-icon" />
        <Typography className="textLoading">Loading...</Typography>
      </div>
    </Box>
  );
}
