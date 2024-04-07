import React, { useState } from "react";
import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function RangeFilter({ setFilt, setShowFilterBtn }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorFilterEl, setAnchorFilterEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [maxFilterValue, setMaxFilterValue] = useState("");
  const [minFilterValue, setMinFilterValue] = useState("");
  const [selectedMainOption, setselectedMainOption] = useState(null);
  const [error, setError] = useState(false);

  const handleFilter = (event) => {
    setAnchorFilterEl(event.currentTarget);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (["name", "cost", "cloud"].includes(option)) {
      setselectedMainOption(option);
    }
    setFilterValue("");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorFilterEl(null);
    setSelectedOption(null);
    setFilterValue("");
  };

  const handleApplyFilter = () => {
    if (filterValue.trim() !== "") {
      setShowFilterBtn(true);
      if (selectedMainOption === "name") {
        if (selectedOption === "is") {
          setFilt({
            items: [
              {
                field: selectedMainOption,
                operator: "equals",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "isnot") {
          setFilt({
            items: [
              {
                field: selectedMainOption,
                operator: "notContains",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "contains") {
          setFilt({
            items: [
              {
                field: selectedMainOption,
                operator: "contains",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "doesnot") {
          setFilt({
            items: [
              {
                field: selectedMainOption,
                operator: "notContains",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "isempty") {
          setFilt({
            items: [
              {
                field: selectedMainOption,
                operator: "isEmpty",
              },
            ],
          });
        } else if (selectedOption === "isnotempty") {
          setFilt({
            items: [
              {
                field: selectedMainOption,
                operator: "isNotEmpty",
                value: filterValue,
              },
            ],
          });
        }
      } else if (selectedMainOption === "cost") {
        if (selectedOption === "equal") {
          setFilt({
            items: [
              {
                field: "cost",
                operator: "=",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "greater") {
          setFilt({
            items: [
              {
                field: "cost",
                operator: ">",
                value: parseInt(filterValue),
              },
            ],
          });
        } else if (selectedOption === "less") {
          setFilt({
            items: [
              {
                field: "cost",
                operator: "<",
                value: parseInt(filterValue),
              },
            ],
          });
        }
      } else if (selectedMainOption === "cloud") {
        if (selectedOption === "is") {
          setFilt({
            items: [
              {
                field: "service",
                operator: "equals",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "isnot") {
          setFilt({
            items: [
              {
                field: "service",
                operator: "contains",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "contains") {
          setFilt({
            items: [
              {
                field: "service",
                operator: "contains",
                value: filterValue,
              },
            ],
          });
        } else if (selectedOption === "doesnot") {
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
    } else {
      if (selectedMainOption === "name") {
        if (selectedOption === "isempty") {
          setShowFilterBtn(true);
          setFilt({
            items: [
              {
                field: "name",
                operator: "isEmpty",
              },
            ],
          });
        } else if (selectedOption === "isnotempty") {
          setShowFilterBtn(true);
          setFilt({
            items: [
              {
                field: "name",
                operator: "isNotEmpty",
              },
            ],
          });
        }
      }
      if (selectedMainOption === "cloud") {
        if (selectedOption === "isempty") {
          setShowFilterBtn(true);

          setFilt({
            items: [
              {
                field: "service",
                operator: "isEmpty",
              },
            ],
          });
        } else if (selectedOption === "isnotempty") {
          setShowFilterBtn(true);
          setFilt({
            items: [
              {
                field: "service",
                operator: "isNotEmpty",
              },
            ],
          });
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
          field: "cost",
          operator: ">=",
          value: parseInt(minFilterValue),
        },
        {
          field: "cost",
          operator: "<=",
          value: parseInt(maxFilterValue),
        },
      ],
    });
  };

  const filterOptions = [
    { id: "1 month", label: "1 month" },
    { id: "3 months", label: "3 months" },
    { id: "6 months", label: "6 months" },
    { id: "9 months", label: "9 months" },
    { id: "1 year", label: "1 year" },
  ];

  return (
    <div>
      <Tooltip title="Select a range">
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "#f5f5f5",
            color: "#9a9a9e",
            borderColor: "#eeeeee",
            marginLeft: "12px",
            padding: "5px 0px 5px 8px",
            fontSize: "10px",
            fontWeight: "600",
            borderRadius: "8px",
          }}
          onClick={handleFilter}
        >
          select period
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
            <ListItem key={option.id} button>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
}

export default RangeFilter;

