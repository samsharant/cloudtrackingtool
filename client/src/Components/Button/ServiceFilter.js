import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Tooltip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ServiceFilter = ({
  setFilt,
  setShowFilterBtn,
  selectedOption,
  setSelectedOption,
  filterNo,
  setFilterNo,
  data
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selOption, setSelOption] = useState();
  const uniqueServiceNames = [...new Set(data.map((service) => service.serviceName.replace("Amazon", "")))];

  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelOption(null);
  };

  const handleOptionToggle = (option) => {
    if (selOption === option) {
      setSelOption(null);
    } else {
      setSelOption(option);
    }
  };

  const handleSubmit = () => {
    setSelectedOption(selOption);
    setShowFilterBtn(true);

    setFilt({
      items: [
        {
          field: "serviceName",
          operator: "contains",
          value: selOption,
        },
      ],
    });
    handleClose();
    setSelectedOption(selOption);
    setFilterNo(2);
  };

  return (
    <div>
      <Tooltip title="Select Cloud Service">
        <Button
          variant="outlined"
          sx={{
            backgroundColor: filterNo === 2 ? "#f5d6b5" : "#f5f5f5",
            color: "#000000",
            borderColor: "#eeeeee",
            ml: "12px",
            fontSize: "12px",
            padding: "9px 4px 9px 9px",
            fontWeight: "600",
            borderRadius: "8px",
            marginRight:"10px"
          }}
          onClick={handleClick}
          color="inherit"
        >
          select a service <ArrowDropDownIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} id="filter-box">
        <Typography
          sx={{ fontWeight: "bold", padding: "12px" }}
          variant="subtitle1"
        >
          Select the Service Type:
        </Typography>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: "10px" }} id="">
            {uniqueServiceNames.map((option, index) => (
              <MenuItem key={option}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={selOption === option}
                      onChange={() => handleOptionToggle(option)}
                      sx={{
                        color: '#FF6F1A',
                        '&.Mui-checked': {
                          color: '#FF6F1A',
                        },
                      }}
                    />
                  }
                  label={option}
                />
              </MenuItem>
            ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            // disabled={!selOption}
            sx={{backgroundColor: '#FF6F1A', mt: 3, opacity: selOption?1:0, transition: 'opacity 0.3s ease-in-out', "&:hover": {backgroundColor: '#d45e14' }}}
          >
            Apply
          </Button>
        </div>
      </Menu>
    </div>
  );
};

export default ServiceFilter;

