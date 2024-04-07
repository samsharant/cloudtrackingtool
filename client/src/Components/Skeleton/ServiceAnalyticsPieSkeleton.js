import { Skeleton } from "@mui/material";
import React from "react";

export default function ServiceAnalyticsPieSkeleton() {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: 1,
            width: "200px",
            height: "200px",
            marginTop: "40px",
          }}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

