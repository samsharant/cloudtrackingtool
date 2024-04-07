import React, { useEffect, useState } from "react";
import "./NewDashboard.css";
import { Link } from "react-router-dom";

//mui select
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Box, Modal } from "@mui/material";
//axios
import axios from "axios";
import { useSelector } from "react-redux";

//chart js
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import { baseUrl } from "../../constants";
import { IconButton } from "@mui/material";
import { usernameSelector } from "../../redux/_selectors/authSelector";
import { accountNameSelector } from "../../redux/_selectors/authSelector";
import vbLogo from "../../Assets/logo_white.png";
import { logout as logoutAction } from "../../redux/_actions/logoutAction";
import { useActions } from "../../Utils";

ChartJS.register(...registerables);

function NewDashboard({ updateLogin }) {
  const [userName, setUserName] = useState(useSelector(usernameSelector));
  const firstName = userName?.split(" ")[0];
  const [accountName, setAccountName] = useState(
    useSelector(accountNameSelector)
  );

  const [periodType, setPeriodType] = useState("ONEWEEK"); // Default value

  const [logout] = useActions([logoutAction]);
  const [hoursLeft, setHoursLeft] = useState(null);

  const [mean, setMean] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [step, setStep] = useState(0);

  const [presentMonthCost, setPresentMonthCost] = useState({
    month: "",
    cost: 0,
  });
  const [previousMonthCost, setPreviousMonthCost] = useState({
    month: "",
    cost: 0,
  });
  const [percentage, setPercentage] = useState(0);
  const [profit, setProfit] = useState(true);

  const [topfiveServices, setTopFiveServices] = useState([]);
  const [pastWeek, setpastWeek] = useState([]);
  const [past3Months, setPast3Months] = useState([]);
  const [pastYear, setPastYear] = useState([]);

  const [toastError, setToastError] = useState(null);

  const [sliderValues, setSliderValues] = useState([min, mean, max]);

  // const periodType = {
  //     ONEWEEK: "pastOneWeek",
  //     THREEMONTHS: "pastThreeMonths",
  //     ONEYEAR: "pastOneYear",
  //   };

  // const data = {
  //   labels: ["23/11", "24/11", "25/11", "26/11", "27/11"],
  //   datasets: [{
  //     label: "Past Week",
  //     borderColor: "#FF6F1A",
  //     data: [2, 5, 1, 7, 3],
  //     fill: false,
  //   }]
  // };
  const [data, setData] = useState({
    labels: [], // Array to store labels (dates or weeks)
    datasets: [
      {
        label: "Cost in $ for Last Week",
        data: [], // Array to store cost values
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });
  // const options = {
  //   scales: {
  //     x: {
  //       type: 'linear',
  //       position: 'bottom',
  //     },
  //   },
  // };
  const [options, setOptions] = useState({
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        labels: [],
      },
      y: {
        beginAtZero: true,
      },
    },
  });
  const renderChartData = (selectedPeriod) => {
    let selectedData;

    // Determine which data array to use based on the selected period
    if (selectedPeriod === "ONEWEEK" && pastWeek.length === 0) {
      const storedData = localStorage.getItem("pastOneWeek");
      selectedData = storedData ? JSON.parse(storedData) : [];
    } else if (selectedPeriod === "THREEMONTHS" && past3Months.length === 0) {
      const storedData = localStorage.getItem("pastThreeMonths");
      selectedData = storedData ? JSON.parse(storedData) : [];
    } else if (selectedPeriod === "ONEYEAR" && pastYear.length === 0) {
      const storedData = localStorage.getItem("pastOneYear");
      selectedData = storedData ? JSON.parse(storedData) : [];
    } else {
      // Use the existing data arrays
      if (selectedPeriod === "ONEWEEK") {
        selectedData = pastWeek;
      } else if (selectedPeriod === "THREEMONTHS") {
        selectedData = past3Months;
      } else if (selectedPeriod === "ONEYEAR") {
        selectedData = pastYear;
      }
    }
    meanMax();
    // Update the chart data
    data.labels = selectedData.map(
      (item) => item.date || item.week || item.month
    );
    data.datasets[0].data = selectedData.map((item) => parseFloat(item.cost));
    let labelval = "1 Week";

    if (periodType === "THREEMONTHS") {
      labelval = "3 months";
    } else if (periodType === "ONEYEAR") {
      labelval = "1 year";
    }
    setOptions({
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          labels: data.labels,
        },
        y: {
          beginAtZero: true,
        },
      },
    });
    setData({
      labels: data.labels, // Array to store labels (dates or weeks)
      datasets: [
        {
          label: `Cost in $ for Last ${labelval}`,
          data: data.datasets[0].data, // Array to store cost values
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
    // Force re-render
    setPeriodType(selectedPeriod);
  };
  const getService = function (val) {
    for (let element in serviceCostData) {
      if (serviceCostData[element] == val) return element;
    }
  };

  const serviceCostData = {
    "Amazon Elastic Cloud Compute": 88.23,
    "Amazon Elastic Load Balancing": 63.46,
    Tax: 14.85,
    "Amazon Elastic Container Service": 34.03,
    "EC2 - Other": 42.52,
  };

  const costData = Object.values(serviceCostData);
  const bgColors = ["#E8713C", "#E8BD3C", "#72F1EE", "#4F3CE8", "#3C90E8"];

  const sortedServices = costData
    .sort((a, b) => b - a)
    .reduce((arr, curr) => {
      arr.push(getService(curr));
      return arr;
    }, []);

  const dataDoughnut = {
    labels: Object.keys(serviceCostData),
    datasets: [
      {
        data: costData,
        backgroundColor: bgColors,
      },
    ],
  };

  // Configuration options
  const optionsDoughnut = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  function isLocalStorageDataValid() {
    const currentTime = new Date().getTime();
    const prevTimestamp = localStorage.getItem("dashboardTimestamp");
    //is invalid, if the prev timestamp exceeds 24 hours
    if (!prevTimestamp || currentTime - prevTimestamp > 86400000) return false;
    else return true;
  }
  function updatePresentMonthCost() {
    //check with local storage before fetching
    // const presentMontCostData = JSON.parse(
    //   localStorage.getItem("presentMonthCost")
    // );
    // if (isLocalStorageDataValid() && presentMontCostData) {
    //   setPresentMonthCost(presentMontCostData);
    //   return;
    // }

    //fetch new data from api
    axios
      .get(`${baseUrl}/dashboard/cost`, {
        params: {
          cloudType: "aws",
          accountId: accountName,
        },
        withCredentials: true,
        credentials: "include",
      })
      .then(function (response) {
        const { month, cost } = response.data.data.presentmonthCostTillDate[0];
        const prevMonth = response.data.data.previousMonthCost[0].month;
        const prevCost = response.data.data.previousMonthCost[0].cost;
        const difference = Math.abs(cost - prevCost);
        const percentageDifference = (difference / Math.abs(prevCost)) * 100;
        const differenceInPercentage = Math.trunc(percentageDifference);
        const isProfit = cost < prevCost;
        setProfit(isProfit);
        setPercentage(differenceInPercentage);
        setPresentMonthCost({ month: month, cost: cost });
        localStorage.setItem(
          "presentMonthCost",
          JSON.stringify({ month: month, cost: cost })
        );
        setPreviousMonthCost({ month: prevMonth, cost: prevCost });
        localStorage.setItem(
          "previousMonthCost",
          JSON.stringify({ month: prevMonth, cost: prevCost })
        );
        setTopFiveServices(response.data.data);
        localStorage.setItem(
          "pastOneWeek",
          JSON.stringify(response.data.data.last7DaysCostPerDay)
        );
        setpastWeek(response.data.data.last7DaysCostPerDay);
        localStorage.setItem(
          "pastThreeMonths",
          JSON.stringify(response.data.data.last3MonthsCostPerWeek)
        );
        setPast3Months(response.data.data.last3MonthsCostPerWeek);

        localStorage.setItem(
          "pastOneYear",
          JSON.stringify(response.data.data.last12MonthsCostPerMonth)
        );
        setPastYear(response.data.data.last12MonthsCostPerMonth);
      })
      .catch((error) => {
        if (error.message.includes("Network Error")) {
          setToastError(true);
        } else {
          toast.error(`API Error: ${error.message}`);
        }
      });
  }

  const logoutUser = () => {
    logout();

    setTimeout(() => {
      updateLogin(false);
    }, 1000); // 1000 milliseconds = 1 second
  };
  function isLocalStorageDataValid() {
    const currentTime = new Date().getTime();
    const prevTimestamp = localStorage.getItem("dashboardTimestamp");
    //is invalid, if the prev timestamp exceeds 24 hours
    if (!prevTimestamp || currentTime - prevTimestamp > 86400000) return false;
    else return true;
  }
  const calculateHoursDifference = (date1, date2) => {
    const diffInMilliseconds = Math.abs(date2 - date1);
    return Math.floor(diffInMilliseconds / (60 * 60 * 1000));
  };
  function meanMax() {
    if (periodType === "ONEWEEK") {
      const costs = pastWeek.map((entry) => parseFloat(entry.cost));

      // Calculate mean, max, and min
      const mean = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
      const max = Math.max(...costs);
      const min = Math.min(...costs);

      const valmean = mean.toFixed(2);
      const valmax = max.toFixed(2);
      const valmin = min.toFixed(2);

      // Display results in the console
      setMean(parseFloat(valmean));
      setMax(parseFloat(valmax));
      setMin(parseFloat(valmin));
    } else if (periodType === "THREEMONTHS") {
      const costs = past3Months.map((entry) => parseFloat(entry.cost));

      // Calculate mean, max, and min
      const mean = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
      const max = Math.max(...costs);
      const min = Math.min(...costs);
      // Display results in the console

      setMean(mean.toFixed(2));
      setMax(max.toFixed(2));
      setMin(min.toFixed(2));
    } else if (periodType === "ONEYEAR") {
      const costs = pastYear.map((entry) => parseFloat(entry.cost));
      // Calculate mean, max, and min
      const mean = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
      const max = Math.max(...costs);
      const min = Math.min(...costs);
      // Display results in the console
      setMean(mean.toFixed(2));
      setMax(max.toFixed(2));
      setMin(min.toFixed(2));
    }
  }
  useEffect(() => {
    // Calculate the step value to visually space out the slider
    const step = (max - min) / 100;
    setSliderValues([min, mean, max]);
    setStep(step);
  }, [min, mean, max]);
  useEffect(() => {
    renderChartData(periodType);
    meanMax();

    if (!isLocalStorageDataValid()) {
      const currentTime = new Date().getTime();
      localStorage.setItem("dashboardTimestamp", currentTime);
      setHoursLeft(24);
    } else {
      const currentTime = new Date().getTime();
      const prevTimestamp = Number(localStorage.getItem("dashboardTimestamp"));
      const hoursDifference = calculateHoursDifference(
        currentTime,
        prevTimestamp
      );
      const hoursLeftForTheNextRefresh = 24 - hoursDifference;
      setHoursLeft(hoursLeftForTheNextRefresh ? hoursLeftForTheNextRefresh : 1);
    }
    // updateTopFiveServices();
    // updatePastThreeMonthsCost();
    // if (!isLocalStorageDataValid()) {
    //   const currentTime = new Date().getTime();
    //   localStorage.setItem("dashboardTimestamp", currentTime);
    //   setHoursLeft(24);
    // } else {
    //   const currentTime = new Date().getTime();
    //   const prevTimestamp = Number(localStorage.getItem("dashboardTimestamp"));
    //   const hoursDifference = calculateHoursDifference(
    //     currentTime,
    //     prevTimestamp
    //   );
    //   const hoursLeftForTheNextRefresh = 24 - hoursDifference;
    //   setHoursLeft(hoursLeftForTheNextRefresh ? hoursLeftForTheNextRefresh : 1);
    // }
  }, [pastWeek, periodType]);
  useEffect(() => {
    updatePresentMonthCost();
  }, []);
  return (
    <div className="page-wrapper">
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#273646",
          height: "15%",
          flexDirection: "row",
          p: 4,
          justifyContent: "space-between",
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div className="navbar-left">
            <img src={vbLogo} />
            <Divider
              orientation="vertical"
              sx={{
                backgroundColor: "#FF6F1A",
                height: "auto",
                width: "auto",
                marginLeft: "2%",
                marginRight: "2%",
              }}
            />
            <Link to={"/dashboard"} style={{ textDecoration: "none" }}>
              <Button
                color="inherit"
                sx={{
                  "&:hover": { color: "orange", textDecoration: "underline" },
                }}
              >
                Dashboard
              </Button>{" "}
            </Link>
            <Link to={"/inventory"} style={{ textDecoration: "none" }}>
              <Button
                color="inherit"
                sx={{
                  "&:hover": { color: "orange", textDecoration: "underline" },
                }}
              >
                Inventory
              </Button>{" "}
            </Link>
            {/* <Link to={"/add-members"} style={{ textDecoration: "none" }}>
              {" "}
              <Button
                color="inherit"
                sx={{
                  "&:hover": { color: "orange", textDecoration: "underline" },
                }}
              >
                Add Members
              </Button>
            </Link> */}
          </div>

          <div className="navbar-right">
            {/* <IconButton color="inherit" aria-label="search">
              <SearchIcon />
            </IconButton> */}
            <span id="profile-greeting">Hello {firstName || "Guest User"}</span>
            <IconButton
              onClick={() => logoutUser()}
              color="inherit"
              aria-label="search"
            >
              <PowerSettingsNewIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <div className="dashboard-bar">
        <div className="dashboard-bar-left">
          <IconButton color="inherit" aria-label="search">
            <CloudQueueIcon />
          </IconButton>
          <span>Cloud Account: </span>
          <span>{accountName}</span>
          {/* <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={accountSelect}
            onChange={handleSelect}
            sx={{
              marginLeft: "20px",
              width: "250px",
              backgroundColor: "#fff6f0",
              border: "1px solid #FF6F1A",
            }}
          >
            <MenuItem value={0}>ALL</MenuItem>
            <MenuItem value={1}>2nd Option</MenuItem>
            <MenuItem value={2}>3rd Option</MenuItem>
          </Select> */}
        </div>
        <div className="dashboard-bar-right">
          <IconButton color="inherit" aria-label="search">
            <RefreshIcon />
          </IconButton>
          <span>{`Cost will be refreshed in ${hoursLeft} ${
            hoursLeft > 1 ? "hours" : "hour"
          }`}</span>
        </div>
      </div>
      <Box
        sx={{
          marginTop: 2,
          marginLeft: "auto",
          marginRight: "auto",
          width: "90%",
        }}
      >
        <Grid container columnGap={2} rowGap={2}>
          <Grid item xs={4} className="grid-item">
            {/* Content for full-width item */}
            <Box
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "85%",
                height: "10%",
              }}
            >
              <span>Total Cost - This Month</span>
              <Typography
                sx={{
                  mt: "0",
                  fontWeight: "bold",
                  color: "#FF6F1A",
                  textAlign: "left",
                  marginTop: "0.5em",
                }}
                component="h4"
                variant="h4"
              >
                {presentMonthCost.cost}/ {presentMonthCost.month}
              </Typography>
              <IconButton
                color="inherit"
                aria-label="search"
                sx={{ marginLeft: "-10px" }}
              >
                {profit ? (
                  <span style={{ color: "red" }}>
                    <ShowChartIcon />
                  </span>
                ) : (
                  <span style={{ color: "green" }}>
                    <ShowChartIcon />
                  </span>
                )}
              </IconButton>
              <span>
                {percentage}% {profit ? "decrease" : "increase"} in comparison
                to last month
              </span>

              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "left",
                  marginTop: "4em",
                }}
                component="h5"
                variant="h5"
              >
                Cost Range Level
              </Typography>
              <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
                <Slider
                  value={sliderValues}
                  step={step}
                  min={min}
                  max={max}
                  marks={[
                    { value: min, label: `Min: $${min}` },
                    { value: mean, label: `Avg: $${mean}` },
                    { value: max, label: `Max: $${max}` },
                  ]}
                  valueLabelDisplay="auto"
                  aria-labelledby="value-slider"
                  disabled
                  sx={{ width: "100%", marginTop: "20px" }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={7} className="grid-item">
            {/* Content for half-width item on small screens */}
            <Box
              sx={{
                marginLeft: "0",
                marginRight: "0",
                width: "100%",
                height: "10%",
              }}
            >
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
                justifyContent="space-between"
                width="90%"
                className="cost-explorer-stack"
              >
                <Typography
                  sx={{ mt: "0", ml: 5, fontWeight: "bold", textAlign: "left" }}
                  component="p"
                  variant="p"
                >
                  Cost Explorer
                </Typography>
                <div>
                  <InputLabel id="demo-select-small-label">Period</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={periodType}
                    onChange={(e) => renderChartData(e.target.value)}
                    label="Period"
                  >
                    <MenuItem value="ONEWEEK">Last one week</MenuItem>
                    <MenuItem value="THREEMONTHS">Last 3 months</MenuItem>
                    <MenuItem value="ONEYEAR">Last 12 months</MenuItem>
                  </Select>
                </div>
              </Stack>
              <Divider
                orientation="vertical"
                sx={{
                  backgroundColor: "grey",
                  height: "5%",
                  width: "auto",
                  marginTop: "2%",
                }}
              ></Divider>
              <Line
                // key={periodType} // Add a unique key to force re-render
                data={data}
                options={options}
                width="650px"
                height="325px"
                id="line-graph"
              />{" "}
            </Box>
          </Grid>
          {/* <Grid item xs={7} className="grid-item"> */}
          {/* Content for one-fourth-width item on small screens, one-third on medium screens and above */}
          {/* <Box
                sx={{
                  marginLeft: '0',
                  marginRight: '0',
                  width: '100%',
                  height: '10%',
                }}>
                <Stack spacing={2} direction="row" sx={{ mb: 1}} alignItems="center" justifyContent='space-between' width='90%' className="cost-explorer-stack">
                  <Typography
                sx={{ mt: "0", ml: 5, fontWeight: "bold", textAlign: 'left' }}
                component="p"
                variant="p"
                >
                Service Analytics
                </Typography>
                <div>
                <InputLabel id="demo-select-small-label">Period</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={periodType.ONEWEEK}
                      label="Period"
                    >
                      <MenuItem value={periodType.ONEWEEK}>
                        Last one week
                      </MenuItem>
                      <MenuItem value={periodType.THREEMONTHS}>
                        Last 3 months
                      </MenuItem>
                      <MenuItem value={periodType.ONEYEAR}>
                        Last 12 months
                      </MenuItem>
                    </Select>
                </div>
                </Stack>
                <Divider
              orientation="vertical"
              sx={{
                  backgroundColor: 'grey',
                  height: '5%',
                  width: 'auto',
                  marginTop: '2%'
              }}>
              </Divider>
              <Stack spacing={2} direction="row" sx={{ mb: 1, pt: 2}} justifyContent='space-between' width='90%' className="cost-explorer-stack">
              <Box
                sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
                }}
                >
                <Typography
                sx={{ mt: "0", fontWeight: "bold", color: '#FF6F1A', textAlign: 'left' }}
                component="h5"
                variant="h5"
                >
                $88.43
                </Typography>
                <Typography
                sx={{ mt: "1", fontWeight: "bold", color: '#273646', textAlign: 'left', marginTop: '0.25em' }}
                component="h5"
                variant="h5"
                >
                Highest-Cost Service
                </Typography>
                <Typography
                sx={{ mt: "1", fontWeight: "bold", color: '#A5A1A0', textAlign: 'left', marginTop: '0.25em' }}
                component="p"
                variant="p"
                >
                Amazon Elastic Computer Cloud
                </Typography>
                <div className="cost-legend">
                {sortedServices.map((service, idx) => (
                    <Typography
                    sx={{ mt: "1", fontWeight: "bold", color: bgColors[idx], textAlign: 'left', marginTop: '0.25em' }}
                    component="p"
                    variant="p"
                    >
                    {service}
                    </Typography>
                ))}
                </div>
            </Box>
              <Doughnut data={dataDoughnut} options={optionsDoughnut} width='517px' height='292px' id="line-graph"/>
              </Stack>
            <Stack spacing={2} direction="row" sx={{ mb: 1, pt: 2}} justifyContent='space-between' width='90%' className="add-service-btn">
              <Button
                  type="submit"
                  size="small"
                  variant="text"
                  sx={{...buttonStyle, width:'20%', height: '100%', color: '#273646'}}
                >
                Add Services
                </Button>
            </Stack>
              </Box>
              </Grid>
              <Grid item xs={4} className="grid-item">                <Box
                sx={{
                  marginLeft: '0',
                  marginRight: '0',
                  width: '100%',
                  height: '10%',
                }}>
                <Stack spacing={2} direction="row" sx={{ mb: 1}} alignItems="center" justifyContent='space-between' width='90%' className="cost-explorer-stack">
                  <Typography
                sx={{ mt: "0", ml: 5, fontWeight: "bold", textAlign: 'left' }}
                component="p"
                variant="p"
                >
                Cost by Service
                </Typography>
                <div>
                <InputLabel id="demo-select-small-label">Period</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={periodType.ONEWEEK}
                      label="Period"
                    >
                      <MenuItem value={periodType.ONEWEEK}>
                        Last one week
                      </MenuItem>
                      <MenuItem value={periodType.THREEMONTHS}>
                        Last 3 months
                      </MenuItem>
                      <MenuItem value={periodType.ONEYEAR}>
                        Last 12 months
                      </MenuItem>
                    </Select>
                </div>
                </Stack>
                <Divider
              orientation="vertical"
              sx={{
                  backgroundColor: 'grey',
                  height: '5%',
                  width: 'auto',
                  marginTop: '2%'
              }}>
              </Divider>
              </Box> */}
          {/* </Grid> */}
        </Grid>
      </Box>
    </div>
  );
}

export default NewDashboard;
