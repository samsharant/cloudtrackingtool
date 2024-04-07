import { Skeleton } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";

export default function CostExplorerPieSkeleton() {
  return (
<div>
  <div style={{ display: "flex" }}>
    <div style={{ position: "relative", width: "50%", marginTop: "15px", marginLeft: "20px" }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="30%"
        height="40px"
      />
    </div>
    <div style={{ position: "relative", width: "50%", marginTop: "15px", marginRight: "20px" }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="40%"
        height="45px"
        style={{ position: "absolute", top: 0, right: 0 }}
      />
    </div>
  </div>
  <Divider style={{ marginTop: "20px" }} />
  <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
    <Skeleton
      variant="rectangular"
      animation="wave"
      width="70%"
      height="250px"
    />
  </div>
</div>
  
  );
}

