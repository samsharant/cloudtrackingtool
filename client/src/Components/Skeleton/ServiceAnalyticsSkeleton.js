import { Skeleton } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";

export default function ServiceAnalyticsSkeleton() {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            position: "relative",
            width: "50%",
            marginTop: "15px",
            marginLeft: "20px",
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="40%"
            height="30px"
          />
        </div>
        <div style={{ position: "relative", width: "40%", marginTop: "15px" }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="30%"
        height="40px"
        style={{ position: "absolute", top: 0, right: 0 }}
      />
    </div>
      </div>
      <Divider style={{ marginTop: "20px" }} />
      <div
        style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="30%"
          height="250px"
          style={{ marginRight: "20px", marginLeft:"20px" }}
        />
        <Skeleton
          variant="circular"
          animation="wave"
          width="35%"
          height="250px"
          style={{ marginRight: "30px" }}

        />
      </div>
    </div>
  );
}
