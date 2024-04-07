import { Box, Skeleton } from "@mui/material";
import skeleton from "../../Assets/cw-inventory-tab-graph.png";

export function InventoryTabSkeleton() {
  return (
    <Box
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      {/* Add an image in the center */}
      <img
        src={skeleton}
        alt="Inventory"
        style={{
          height: "50%",
          position: "absolute",
        }}
      />
    </Box>
  );
}

