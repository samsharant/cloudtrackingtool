import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import "./InventoryTab.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CostByRegion from "../Graph/CostByRegion";
import CostByInstance from "../Graph/CostByInstance";
import { InventoryTabSkeleton } from "../Skeleton/InventoryTabSkeleton";
import Error from "@mui/icons-material/Error";

const InventoryTab = ({ data, loading, error }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabPanelStyle = {
    width: "100%", // Adjust the width as needed
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "#e6923a",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      {loading || error ? (
        <>
          {loading && <InventoryTabSkeleton />}
          {error && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "15%",
              }}
            >
              <Error />
              <Typography
                sx={{ fontWeight: "bold" }}
                component="p"
                variant="caption"
              >
                Something went wrong
              </Typography>
            </div>
          )}
        </>
      ) : (
        <Box className="tab-container" display="flex">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            sx={{
              marginTop: 1.5,
              ".MuiTabs-indicator": {
                left: 0,
                right: "auto",
                top: "auto",
                bottom: 0,
              },
            }}
          >
            <Tab
              label="Cost by region"
              sx={{ fontSize: "small", fontWeight: "bold" }}
            />
            <Tab
              label="Cost by instance"
              sx={{ fontSize: "small", fontWeight: "bold" }}
            />
          </Tabs>
          <TabPanel value={value} index={0} style={tabPanelStyle}>
            <CostByRegion data={data} />
          </TabPanel>
          <TabPanel value={value} index={1} style={tabPanelStyle}>
            <CostByInstance data={data} />
          </TabPanel>
        </Box>
      )}
    </ThemeProvider>
  );
};

function TabPanel(props) {
  const { children, value, index, style } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      style={style}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default InventoryTab;

