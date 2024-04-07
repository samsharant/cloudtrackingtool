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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function FilterDropdown({
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
  const [selectedMainOption, setselectedMainOption] = useState(null);
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
    setSelectedSecondOption(null);
    setFilterValue("");
  };

  const handleOptionClick = (option) => {
    setSelectedSecondOption(option);
    if (["name", "servicecost", "cloud"].includes(option)) {
      setselectedMainOption(option);
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
                field: 'serviceName',
                operator: "equals",
                value: filterValue,
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
                field: 'serviceName',
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
                field: 'serviceName',
                operator: "contains",
                value: filterValue,
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
                field: 'serviceName',
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
                field: 'serviceName',
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
                field: 'serviceName',
                operator: "isNotEmpty",
                value: filterValue,
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        }
      } else if (selectedMainOption === "servicecost") {
        console.log("1st step")
        if (selectedSecondOption === "equal") {
          setFilt({
            items: [
              {
                field: "serviceCost",
                operator: "=",
                value: filterValue,
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "greater") {
          console.log("2nd step")
          console.log(parseInt(filterValue))
          setFilt({
            items: [
              {
                field: "serviceCost",
                operator: ">",
                value: parseInt(filterValue),
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        } else if (selectedSecondOption === "less") {
          setFilt({
            items: [
              {
                field: "serviceCost",
                operator: "<",
                value: parseInt(filterValue),
              },
            ],
          });
        }
        setSelectedOption(
          selectedMainOption + " " + selectedSecondOption + " " + filterValue
        );
      } else if (selectedMainOption === "cloud") {
        if (selectedSecondOption === "is") {
          setFilt({
            items: [
              {
                field: "service",
                operator: "equals",
                value: filterValue,
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
                field: "service",
                operator: "contains",
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
                field: "service",
                operator: "contains",
                value: filterValue,
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
                field: "service",
                operator: "notContains",
                value: filterValue,
              },
            ],
          });
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
                field: "name",
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
                field: "name",
                operator: "isNotEmpty",
              },
            ],
          });
          setSelectedOption(
            selectedMainOption + " " + selectedSecondOption + " " + filterValue
          );
        }
      }
      if (selectedMainOption === "cloud") {
        if (selectedSecondOption === "isempty") {
          setShowFilterBtn(true);

          setFilt({
            items: [
              {
                field: "service",
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
                field: "service",
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
    <div style={{marginLeft:'20px'}}>
      <Tooltip title="Create a filter">
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
          Create a filter
          <AddCircleOutlineIcon sx={{ ml: "4px", height: "16px" }} />
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
        {selectedSecondOption ? (
          <>
            <List>
              <ListItem button onClick={() => setSelectedSecondOption(null)}>
                <ListItemIcon>
                  <ArrowBackIcon />
                </ListItemIcon>
                <ListItemText primary="Back" />
              </ListItem>
              {subOptions[selectedSecondOption]
                ? subOptions[selectedSecondOption].map((option) => (
                    <ListItem
                      key={option.id}
                      button
                      onClick={() => handleOptionClick(option.id)}
                    >
                      <ListItemIcon>
                        {
                          options.find((opt) => opt.id === selectedSecondOption)
                            ?.icon
                        }
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
                          helperText={
                            error ? "Filter Value cannot be empty" : ""
                          } // Display error message when error is true
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
                      onClick={handleApplyFilter}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </>
              )}
          </>
        ) : (
          <List>
            {options.map((option) => (
              <ListItem
                key={option.id}
                button
                onClick={() => handleOptionClick(option.id)}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </div>
  );
}

export default FilterDropdown;

