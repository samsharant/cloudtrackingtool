import React, { useState } from "react";
import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
} from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function NameDropdown({
  filterNo,
  setFilterNo,
  setFilt,
  setShowFilterBtn,
  setSelectedOption,
  setSort,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorFilterEl, setAnchorFilterEl] = useState(null);
  const [selectedSecondOption, setSelectedSecondOption] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [maxFilterValue, setMaxFilterValue] = useState("");
  const [minFilterValue, setMinFilterValue] = useState("");
  const [selectedMainOption, setselectedMainOption] = useState("name");
  const [error, setError] = useState(false);

  const subOptionsWithFilter = [
    "is",
    "isnot",
    "contains",
    "doesnot",
    "isempty",
    "isnotempty",
    "equal",
    "between",
    "greater",
    "less",
  ];

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedSecondOption("name");
    setFilterValue("");
  };

  const handleOptionClick = (option) => {
    setSelectedSecondOption(option);
    if (["name", "servicecost", "cloud"].includes(option)) {
      setselectedMainOption("name");
    }
    setFilterValue("");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorFilterEl(null);
    setSelectedSecondOption(null);
    setFilterValue("");
  };

  const handleSort = (option) => {
    if (option.id === "servicecost high to low") {
      setSort([{ field: "servicecost", sort: "desc" }]);
    } else if (option.id === "servicecost low to high") {
      setSort([{ field: "servicecost", sort: "asc" }]);
    } else if (option.id === "name in ascending") {
      setSort([{ field: "name", sort: "asc" }]);
    } else if (option.id === "name in descending") {
      setSort([{ field: "name", sort: "desc" }]);
    }
  };

  const handleApplyFilter = () => {
    setAnchorEl(null);
    setFilterNo(1);
    if (filterValue.trim() !== "") {
      setShowFilterBtn(true);
      if (selectedMainOption === "name") {
        if (selectedSecondOption === "is") {
        

          setFilt({
            items: [
              {
                field: "Name",
                operator: "equals",
                value: filterValue.toLowerCase(),
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "isnot") {
          setFilt({
            items: [
              {
                field: "serviceName",
                operator: "notContains",
                value: filterValue,
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "contains") {
    
          setFilt({
            items: [
              {
                field: "Name",
                operator: "contains",
                value: filterValue.toLowerCase(),
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "doesnot") {
          setFilt({
            items: [
              {
                field: "serviceName",
                operator: "notContains",
                value: filterValue,
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "isempty") {
          setFilt({
            items: [
              {
                field: "serviceName",
                operator: "isEmpty",
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "isnotempty") {
          setFilt({
            items: [
              {
                field: "serviceName",
                operator: "isNotEmpty",
                value: filterValue,
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        }
      }
      setError(false); // Reset the error state
      setSelectedOption(
        selectedMainOption + " " + selectedSecondOption + " " + filterValue
      );
    } else {
      if (selectedMainOption === "name") {
        if (selectedSecondOption === "isempty") {
          setShowFilterBtn(true);
          setFilt({
            items: [
              {
                field: "serviceName",
                operator: "isEmpty",
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "isnotempty") {
          setShowFilterBtn(true);
          setFilt({
            items: [
              {
                field: "serviceName",
                operator: "isNotEmpty",
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        }
      }
      setError(true); // Set the error state to true
    }
  };

  const handleApplyInBetweenFilter = () => {
    // Handle applying the "In Between" filter with the selected min and max values
    setFilt({
      items: [
        {
          field: "servicecost",
          operator: ">=",
          value: parseInt(minFilterValue),
        },
        {
          field: "servicecost",
          operator: "<=",
          value: parseInt(maxFilterValue),
        },
      ],
    });
  };

  const options = [
    { id: "name", label: "Name", icon: <AbcIcon /> },
    { id: "servicecost", label: "serviceCost", icon: <MonetizationOnIcon /> },
    // { id: "cloud", label: "Cloud Service", icon: <CloudIcon /> },
  ];

  const filterOptions = [
    { id: "servicecost high to low", label: "servicecost high to low" },
    { id: "servicecost low to high", label: "servicecost low to high" },
    { id: "name in ascending", label: "name in ascending" },
    { id: "name in descending", label: "name in descending" },
  ];

  const subOptions = {
    name: [
      { id: "is", label: "Is" },
      // { id: "isnot", label: "Is not" },
      { id: "contains", label: "Contains" },
      // { id: "doesnot", label: "Does not contains" },
      { id: "isempty", label: "Is empty" },
      { id: "isnotempty", label: "Is not empty" },
    ],
    servicecost: [
      { id: "equal", label: "Equal to" },
      // { id: "between", label: "In Between" },
      { id: "greater", label: "Greater than" },
      { id: "less", label: "Less than" },
    ],
    cloud: [
      { id: "is", label: "Is" },
      // { id: "isnot", label: "Is not" },
      { id: "contains", label: "Contains" },
      // { id: "doesnot", label: "Does not contains" },
      { id: "isempty", label: "Is empty" },
      { id: "isnotempty", label: "Is not empty" },
    ],
  };
  return (
    <div style={{ marginLeft: "20px" }}>
      <Tooltip title="Name">
        <Button
          variant="outlined"
          sx={{
            backgroundColor: filterNo === 1 ? "#f5d6b5" : "#f5f5f5",
            color: "#000000",
            borderColor: "#eeeeee",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "8px 12px 8px 8px",
          }}
          onClick={handleFilterClick}
        >
          Name
          <ArrowDropDownIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Popover
        open={Boolean(anchorFilterEl)}
        anchorEl={anchorFilterEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          {filterOptions.map((option) => (
            <ListItem key={option.id} button onClick={() => handleSort(option)}>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Popover>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <>
          <List>
          {!(selectedSecondOption == "name") && (
              <ListItem button onClick={() => setSelectedSecondOption("name")}>
                <ListItemIcon>
                  <ArrowBackIcon />
                </ListItemIcon>
                <ListItemText primary="Back" />
              </ListItem>
            )}
            {subOptions[selectedSecondOption]
              ? subOptions[selectedSecondOption].map((option) => (
                  <ListItem
                    key={option.id}
                    button
                    onClick={() => handleOptionClick(option.id)}
                  >
                    <ListItemIcon>
                      <AbcIcon />
                    </ListItemIcon>
                    <ListItemText primary={option.label} />
                  </ListItem>
                ))
              : null}
          </List>
          {selectedSecondOption === "between" && (
            <>
              <TextField
                label="Min Value"
                variant="outlined"
                fullWidth
                value={minFilterValue}
                onChange={(e) => setMinFilterValue(e.target.value)}
              />
              <TextField
                label="Max Value"
                variant="outlined"
                fullWidth
                value={maxFilterValue}
                onChange={(e) => setMaxFilterValue(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleApplyInBetweenFilter}
              >
                Apply Filter
              </Button>
            </>
          )}
          {subOptionsWithFilter.includes(selectedSecondOption) &&
            selectedSecondOption !== "between" && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {selectedSecondOption !== "isempty" &&
                    selectedSecondOption !== "isnotempty" && (
                      <TextField
                        label="Filter Value"
                        variant="outlined"
                        style={{
                          width: "200px",
                          height: "auto",
                          marginBottom: "10px",
                          display: "block",
                          marginRight: "10px",
                          marginLeft: "10px",
                        }}
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        error={error}
                        helperText={error ? "Filter Value cannot be empty" : ""} // Display error message when error is true
                        InputLabelProps={{
                          style: { color: "grey" } // Change color of label here
                        }}
                      />
                    )}
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    style={{
                      width: "130px",
                      height: "auto",
                      display: "block",
                      marginRight: "10px",
                      marginLeft: "10px",
                      marginBottom: "10px",
                    }}
                    sx={{backgroundColor: '#FF6F1A', "&:hover": {backgroundColor: '#d45e14' }}}
                    onClick={handleApplyFilter}
                  >
                    Apply Filter
                  </Button>
                </div>
              </>
            )}
        </>
      </Popover>
    </div>
  );
}

export default NameDropdown;
