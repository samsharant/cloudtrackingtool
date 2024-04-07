import { Skeleton } from "@mui/material";
import React from "react";

export default function ServiceAnalyticsGraphSkeleton() {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "500px",
            height: "300px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

