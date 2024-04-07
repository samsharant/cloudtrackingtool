import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import NavigationTab from "../NavigationTab/NavigationTab";
import { tabTypes } from "../../constants";
import "./AddMembersPage.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e6923a",
    },
  },
});
export default function AddMembersPage() {
  const [memberInfo, setMemberInfo] = useState({
    email: "",
    name: "",
    level: "1", // Default level as '1'
  });

  const [gridData, setGridData] = useState([
    // Example data with random values
    { id: 1, name: "John Doe", email: "john@example.com", level: "1" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", level: "2" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", level: "3" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to submit member information here

    // Add the new member to the DataGrid
    const newMember = {
      id: gridData.length + 1,
      ...memberInfo,
    };
    setGridData((prevData) => [...prevData, newMember]);

    // Clear the input fields after submission
    setMemberInfo({
      email: "",
      name: "",
      level: "1",
    });
  };

  return (
    <div className="page-wrapper">
      <NavigationTab activeTab={tabTypes.ADDMEMBERS} />
      <div className="inventory-wrapper">
        <div className="inventory-main-container">
          <div className="content-wrapper">
            <div className="table-container">
              <h2>Add Member</h2>
              <ThemeProvider theme={theme}>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <form onSubmit={handleSubmit}>
                    {/* Input fields */}
                    <TextField
                      label="Email"
                      name="email"
                      value={memberInfo.email}
                      onChange={handleInputChange}
                      size="small"
                      className="white-background"
                      sx={{ margin: "10px", width: "100%" }}
                    />
                    <TextField
                      label="Name"
                      name="name"
                      value={memberInfo.name}
                      onChange={handleInputChange}
                      size="small"
                      className="white-background"
                      sx={{ margin: "10px", width: "100%" }}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Access Level</InputLabel>
                      <Select
                        name="level"
                        value={memberInfo.level}
                        onChange={handleInputChange}
                        className="white-background"
                        sx={{ margin: "10px", width: "100%", height: "40px" }}
                      >
                        <MenuItem value="1">Level 1</MenuItem>
                        <MenuItem value="2">Level 2</MenuItem>
                        <MenuItem value="3">Level 3</MenuItem>
                        <MenuItem value="4">Level 4</MenuItem>
                      </Select>
                    </FormControl>
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Button
                          size="small"
                          type="submit"
                          variant="text"
                          color="primary"
                        >
                          Add Member
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </ThemeProvider>

              {/* DataGrid */}
              <div
                style={{ height: "400px", width: "100%" }}
                className="white-table"
              >
                <DataGrid
                  sx={{
                    borderRadius: 0,
                    borderWidth: 0,
                  }}
                  rows={gridData}
                  columns={[
                    { field: "id", headerName: "ID", width: 70 },
                    { field: "name", headerName: "Name", width: 200 },
                    { field: "email", headerName: "Email", width: 250 },
                    { field: "level", headerName: "Level", width: 100 },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

