import { Skeleton } from "@mui/material";
import React from "react";

export default function TotalCostCardSkeleton() {
  return (
    <div style={{ marginTop: "12px", marginLeft:"10px" }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="30%"
        height="20px"
        style={{ marginBottom: "10px", marginLeft: "15px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="75%"
        height="45px"
        style={{ marginBottom: "10px", marginLeft: "15px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="80%"
        height="25px"
        style={{ marginBottom: "10px", marginLeft: "15px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="60%"
        height="25px"
        style={{ marginBottom: "10px", marginLeft: "15px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="40%"
        height="35px"
        style={{ marginBottom: "10px",  marginLeft: "15px", marginTop:"25px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="80%"
        height="40px"
        style={{ marginBottom: "10px",  marginLeft: "25px", marginTop:"10px" }}
      />
    </div>
  );
}
