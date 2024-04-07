import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  Box,
  Typography,
  MenuItem,
  InputAdornment,
  FormControl,
  Select,
  IconButton,
} from "@mui/material";
import ArrowUpwardOutlined from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlined from "@mui/icons-material/ArrowDownwardOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
//axios
import axios from "axios";

//chart js
import { toast } from "react-toastify";
import { baseUrl, currency } from "../../constants";
import CostExplorerPieSkeleton from "../Skeleton/CostExplorerPieSkeleton";
import ServiceAnalyticsSkeleton from "../Skeleton/ServiceAnalyticsSkeleton";
import CostByServiceSkeleton from "../Skeleton/CostByServiceSkeleton";
import TotalCostCardSkeleton from "../Skeleton/TotalCostCardSkeleton";
import errorGraph from "../../Assets/cw-graphError.png";
import redEllipse from "../../Assets/redEllipse.png";
import yellowEllipse from "../../Assets/yellowEllipse.png";
import darkBlueEllipse from "../../Assets/darkBlueEllipse.png";
import blueEllipse from "../../Assets/blueEllipse.png";
import cyanEllipse from "../../Assets/cyanEllipse.png";
import errorPie from "../../Assets/cw-pieError.png";
import ZoomModal from "../ZoomModal/ZoomModal";
import NewNavbar from "../NewNavbar/NewNavbar";
import SecondaryBar from "../SecondaryBar/SecondaryBar";
import FooterCopyright from "../FooterCopyright/FooterCopyright";
import Slider from "@mui/material/Slider";
import { usernameSelector } from "../../redux/_selectors/authSelector";
import { accountNameSelector } from "../../redux/_selectors/authSelector";
import { useSelector } from "react-redux";
import DashboardTable from "./DashboardTable";
import setupCharts from "../../Utils/setupCharts";
import DoughnutChart from "../Charts/DoughnutChart";
import LineChart from "../Charts/LineChart";

function Dashboard({
  updateLogin,
  apiHit,
  setApiHit,
  setInventoryData,
  inventoryData,
  delayError,
  setDelayError,
  networkInventoryError,
  setNetworkInventoryError,
}) {
  const [hoursLeft, setHoursLeft] = useState(null);
  const [toastError, setToastError] = useState(null);
  const [open, setOpen] = useState(false);
  const [graphNo, setGraphNo] = useState(0);
  const [hCost, setHCost] = useState(0);
  const [top5Services, setTop5Services] = useState({});
  const [top5Total, setTop5Total] = useState(0);
  const [hService, setHService] = useState(0);
  const [modaData, setMOdalData] = useState();
  const [userName, setUserName] = useState(useSelector(usernameSelector));
  const firstName = userName?.split(" ")[0];
  const [skeleton, setSkeleton] = useState(true);

  const [presentMonthCost, setPresentMonthCost] = useState({
    month: "",
    cost: 0,
  });
  const [previousMonthCost, setPreviousMonthCost] = useState({
    month: "",
    cost: 0,
  });

  const [topfiveServices, setTopFiveServices] = useState([]);
  const [networkg1Error, setNetworkg1Error] = useState(false);
  const [pastWeek, setpastWeek] = useState([]);
  const [past3Months, setPast3Months] = useState([]);
  const [pastYear, setPastYear] = useState([]);
  const [periodType, setPeriodType] = useState("ONEWEEK"); // Default value
  const [profit, setProfit] = useState(true);
  const [mean, setMean] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [step, setStep] = useState("");
  const [sliderValues, setSliderValues] = useState([min, mean, max]);
  const [percentage, setPercentage] = useState();

  const bgColors = [
    "rgba(232, 113, 60, 1)",
    "rgba(232, 189, 60, 1)",
    "rgba(114, 241, 238, 1)",
    "rgba(79, 60, 232, 1)",
    "rgba(60, 144, 232, 1)",
  ];
  const ellipses = [
    redEllipse,
    yellowEllipse,
    cyanEllipse,
    darkBlueEllipse,
    blueEllipse,
  ];

  const [accountName, setAccountName] = useState(
    useSelector(accountNameSelector)
  );

  const [data, setData] = useState({
    labels: [], // Array to store labels (dates or weeks)
    datasets: [
      {
        label: "Cost in $ for Last Week",
        data: [], // Array to store cost values
        tension: 0.4, // Adjust tension for curve
        fill: false,
        borderColor: "#ff6f1a", // Line color
      },
    ],
  });

  const [doughnutData, setDoughnutData] = useState({
    labels: Object.keys(top5Services),
    datasets: [
      {
        label: "Cost",
        data: Object.values(top5Services),
        backgroundColor: bgColors,
        borderWidth: 0,
        borderColor: "#000",
      },
    ],
  });

  const [doughnutOptions, setDoughnutOptions] = useState({
    cutout: 100,
    responsive: false,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = "";
            label += "$" + context.parsed;
            return label;
          },
        },
      },
    },
  });

  const [options, setOptions] = useState({
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        labels: [],
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  });

  // function isLocalStorageDataValid() {
  //   const currentTime = new Date().getTime();
  //   const prevTimestamp = localStorage.getItem("dashboardTimestamp");
  //   //is invalid, if the prev timestamp exceeds 24 hours
  //   if (!prevTimestamp || currentTime - prevTimestamp > 86400000) return false;
  //   else return true;
  // }
  const renderChartData = (selectedPeriod) => {
    let selectedData;
    const formattedData = pastYear.map((item) => ({
      ...item,
      month: item.month.replace("-01", ""),
      // replace month in number to name
    }));
    // Determine which data array to use based on the selected period
    if (selectedPeriod === "ONEWEEK" && pastWeek.length === 0) {
      const storedData = localStorage.getItem("pastOneWeek");
      selectedData = storedData ? JSON.parse(storedData) : [];
    } else if (selectedPeriod === "THREEMONTHS" && past3Months.length === 0) {
      const storedData = localStorage.getItem("pastThreeMonths");
      selectedData = storedData ? JSON.parse(storedData) : [];
    } else if (selectedPeriod === "ONEYEAR" && formattedData.length === 0) {
      const storedData = localStorage.getItem("pastOneYear");
      selectedData = storedData ? JSON.parse(storedData) : [];
    } else {
      // Use the existing data arrays
      if (selectedPeriod === "ONEWEEK") {
        selectedData = pastWeek;
      } else if (selectedPeriod === "THREEMONTHS") {
        selectedData = past3Months;
      } else if (selectedPeriod === "ONEYEAR") {
        selectedData = formattedData;
      }
    }
    meanMax();
    // Update the chart data
    data.labels = selectedData.map(
      (item) => item.date || item.week || item.month
    );
    data.datasets[0].data = selectedData.map((item) => parseFloat(item.cost));
    let labelval = "Cost in $ per day for last 1 Week";

    if (periodType === "THREEMONTHS") {
      labelval = "Cost in $ per week for last 3 months";
    } else if (periodType === "ONEYEAR") {
      labelval = "Cost in $ per month for last 1 year";
    }
    const lastDataIndex = data.datasets[0].data.length - 1;

    setOptions({
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          labels: data.labels,
          grid: {
            display: false, // Hide vertical grid lines
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value, index, values) {
              return "$" + value;
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = "";
              label += "$" + context.parsed.y;
              return label;
            },
          },
        },
      },
    });
    setData({
      labels: data.labels, // Array to store labels (dates or weeks)
      datasets: [
        {
          label: `${labelval}`,
          data: data.datasets[0].data, // Array to store cost values
          fill: false,
          tension: 0.4, // Adjust tension for curve
          borderColor: "#ff6f1a", // Line color
          backgroundColor: "#ff6f1a", // Fill color
          pointRadius: 5,
          borderWidth: 1,
          pointStyle: (context) =>
            context.dataIndex === lastDataIndex && periodType === "ONEYEAR"
              ? "star"
              : "circle", // Set pointStyle for the last point
        },
      ],
    });
    // Force re-render
    setPeriodType(selectedPeriod);
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

      const valmean = mean.toFixed(2);
      const valmax = max.toFixed(2);
      const valmin = min.toFixed(2);

      // Display results in the console
      setMean(parseFloat(valmean));
      setMax(parseFloat(valmax));
      setMin(parseFloat(valmin));
    } else if (periodType === "ONEYEAR") {
      const costs = pastYear.map((entry) => parseFloat(entry.cost));
      // Calculate mean, max, and min
      const mean = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
      const max = Math.max(...costs);
      const min = Math.min(...costs);
      // Display results in the console
      const valmean = mean.toFixed(2);
      const valmax = max.toFixed(2);
      const valmin = min.toFixed(2);

      // Display results in the console
      setMean(parseFloat(valmean));
      setMax(parseFloat(valmax));
      setMin(parseFloat(valmin));
    }
  }

  function isLocalStorageDataValid() {
    const currentTime = new Date();
    const prevTimestamp = localStorage.getItem("dashboardTimestamp");
    // const prevTimestamp = '1710872872000';

    // Check if prevTimestamp exists and is from the same day
    if (prevTimestamp) {
      // Convert prevTimestamp to a Date object
      const prevTime = new Date(parseInt(prevTimestamp));
      // console.log(prevTime.getDate());
      // console.log(currentTime.getDate());
      // console.log("--------------------");
      // console.log(prevTime.getMonth());
      // console.log(currentTime.getMonth());
      // console.log("--------------------");
      // console.log(prevTime.getFullYear());
      // console.log(currentTime.getFullYear());
      // console.log("--------------------");

      // Check if prevTimestamp is within the same day as currentTime
      if (
        prevTime.getDate() === currentTime.getDate() &&
        prevTime.getMonth() === currentTime.getMonth() &&
        prevTime.getFullYear() === currentTime.getFullYear()
      ) {
        // Still within the same day, return true
        return true;
      }
    }

    // If prevTimestamp doesn't exist or is not from the same day, return false
    return false;
  }

  function updateInventoryTable() {
    setApiHit(true);
    const tableDataResponse = JSON.parse(
      localStorage.getItem("inventoryTableData")
    );
    if (isLocalStorageDataValid() && tableDataResponse.length) {
      // const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
      // await delay(10000);
      setApiHit(false);
      setInventoryData(tableDataResponse);
      let highestCost = 0;
      let highestCostService = null;

      tableDataResponse?.forEach((service) => {
        const totalCost = parseFloat(service.total_cost);
        if (totalCost > highestCost) {
          highestCost = totalCost;
          highestCostService = service;
        }
      });
      setHCost(highestCost);
      setHService(highestCostService);
      const sortedServices = tableDataResponse.sort(
        (a, b) => parseFloat(b.total_cost) - parseFloat(a.total_cost)
      );

      const tCost = tableDataResponse.reduce(
        (acc, service) => acc + parseFloat(service.total_cost),
        0
      );

      const taggedCost = tableDataResponse.reduce((acc, service) => {
        // Check if service has non-empty tags
        if (
          Object.keys(service.Details[0]?.regionDetails[0]?.Tags || {}).length >
          0
        ) {
          // Add the cost to accumulator
          return acc + parseFloat(service.total_cost);
        }
        return acc; // Skip this service if tags are empty
      }, 0);

      // Extract top 5 services
      // Extract top 5 services
      const top5Servicess = {};
      let totalCostTop5 = 0; // Initialize total cost of top 5 services to 0
      for (let i = 0; i < Math.min(5, sortedServices.length); i++) {
        const service = sortedServices[i];
        // Remove "Amazon" from service name
        const serviceNameWithoutAmazon = service.serviceName
          .replace(/Amazon/gi, "")
          .trim();
        top5Servicess[serviceNameWithoutAmazon] = parseFloat(
          service.total_cost
        );
        totalCostTop5 += parseFloat(service.total_cost); // Add cost of current service to total
      }

      // this.setState({ top5Services });
      setTop5Services(top5Servicess);
      setTop5Total(totalCostTop5.toFixed(2));
      setDoughnutData({
        labels: Object.keys(top5Servicess),
        datasets: [
          {
            label: "Cost",
            data: Object.values(top5Servicess),
            backgroundColor: bgColors,
            borderWidth: 0,
            borderColor: "#000",
          },
        ],
      });
      setupCharts(
        totalCostTop5.toFixed(2),
        top5Servicess,
        tCost.toFixed(2),
        taggedCost
      );

      //call function of chartjs
      // console.log(highestCostService)
    } else {
      //Static Response
      const tableDataResponse = [
        {
          serviceName: "AWSBackup",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0.0000424,
                  ARN: "9f9948b4-0c49-4071-9629-60ddf9618ea6",
                  Tags: {
                    user_name: "eversana",
                  },
                },
              ],
            },
          ],
        },
        {
          serviceName: "AWSCostExplorer",
          total_cost: "0.19",
          usage_cost: "0.16",
          tax_cost: "0.03",
          Details: [
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0.1580693333,
                  ARN: "",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AWSDataTransfer",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [],
        },
        {
          serviceName: "AWSELB",
          total_cost: "6.74",
          usage_cost: "5.71",
          tax_cost: "1.03",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 2.8509165953999953,
                  ARN: "loadbalancer/app/Cloud/d60a41e085f9b403",
                  Tags: {
                    user_environment: "Development / QA / Staging / Production",
                    user_name: "Valuebound Products Load Balancer",
                  },
                },
                {
                  service_cost: 2.8574724791999953,
                  ARN: "loadbalancer/app/one-place-alb/61f363d779829996",
                  Tags: {
                    user_environment: "Project",
                    user_name: "Oneplace",
                  },
                },
              ],
            },
          ],
        },
        {
          serviceName: "AWSGlue",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AWSLambda",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "digital-experience-plateform-dev-DXP",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "vbdrupalmarketplace",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "projects_to_sheets",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AWSQueueService",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AWSSecretsManager",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonApiGateway",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0.000158,
                  ARN: "/restapis/muid9fwtuh/stages/dev",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonCloudFront",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "distribution/EGNWQZNRGFGKA",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "eu-west-1",
              regionName: "Ireland",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "distribution/EGNWQZNRGFGKA",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "distribution/EGNWQZNRGFGKA",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonCloudWatch",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "ap-southeast-1",
              regionName: "Singapore",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.CloudFrontResponseHeaderAlter",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.CacheResponseAlter",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "us-east-2",
              regionName: "Ohio",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.CacheResponseAlter",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "eu-north-1",
              regionName: "Stockholm",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/test-function",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/projects_to_sheets",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/Project_camp-to-google_sheets",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "aws-cloudtrail-logs-713496944077-78226790",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/test",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/one-place1",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/test-server-pmt",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/performance-management",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/octiwave-parquet-processor",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/chatgpt-search-api-td",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/chatgpt-search-client-td",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/vbdrupalmarketplace",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/digital-experience-plateform-dev-DXP",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/test_function",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/lambda-test-1",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/qa-oneplace-td",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.CacheResponseAlter",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/oneplace-erp-task",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "/aws/lambda/AwsServerlessExpressStack-AwsServerlessExpressFunc-RN2FOOV8HWJ3",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/lambda-1",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/Oneplace-Production-TD",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "/aws/lambda/AwsServerlessExpressStack-AwsServerlessExpressFunc-4X3TA89BLCA2",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/api-gateway/aws-node-dev",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/CloudFrontResponseHeaderAlter",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/CacheResponseAlter",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "/aws/lambda/ConnectToEconomize-IntegrateAthe-AWSCURInitializer-JX122iKRheMv",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/aws-node-dev-getAllFiles",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/aws-node-dev-uploadFile",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/projects_to_sheets",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "/aws/lambda/AwsServerlessExpressStack-AwsServerlessExpressFunc-ET3A6GLKWJF2",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/oneplace-qa",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/AH-url-rewrite",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/lambda-test-dev-hello",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "/aws/lambda/AwsServerlessExpressStack-AwsServerlessExpressFunc-FNKB1MROUFO6",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws-glue/crawlers",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "API-Gateway-Execution-Logs_878zapmc3a/dev",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "/aws/lambda/American-Heritage-AmericanHeritageAwsLambdaFunctio-103VQUQYJ3S4C",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/ecs/oneplace-prod",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/apigateway/welcome",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "/aws/lambda/AwsServerlessExpressStack-AwsServerlessExpressFunc-1JNGLRQMGRBH3",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "eu-central-1",
              regionName: "Frankfurt",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.CacheResponseAlter",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "ap-southeast-2",
              regionName: "Sydney",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "us-west-2",
              regionName: "Oregon",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.CacheResponseAlter",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "ap-northeast-1",
              regionName: "Tokyo",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "ap-northeast-2",
              regionName: "Seoul",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "eu-west-2",
              regionName: "London",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "/aws/lambda/us-east-1.AmericanHeritageLambda",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonDynamoDB",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "table/test",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonEC2",
          total_cost: "14.24",
          usage_cost: "12.07",
          tax_cost: "2.17",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 5.9025040099999915,
                  ARN: "i-094faf7ce8a5eef01",
                  Tags: {
                    user_environment: "Production",
                    user_name: "OptiWave.Cloud-PROD",
                  },
                },
                {
                  service_cost: 0.7382096762999989,
                  ARN: "i-0de8c6480996e6556",
                  Tags: {
                    user_environment: "Production",
                    user_name: "AuditDrupal1",
                  },
                },
                {
                  service_cost: 1.3229565807999981,
                  ARN: "i-086eb51082ba2b2a2",
                  Tags: {
                    user_environment: "Development",
                    user_name: "Accessibility Checker-DEV",
                  },
                },
                {
                  service_cost: 1.1284871299999988,
                  ARN: "i-078857bd7affe53e1",
                  Tags: {
                    user_environment: "Production",
                    user_name: "Accessibility Checker-PROD",
                  },
                },
                {
                  service_cost: 0.7392610494999989,
                  ARN: "i-0fc5b9f76c209bfe0",
                  Tags: {
                    user_environment: "Production",
                    user_name: "Oneplace-DB-PROD",
                  },
                },
                {
                  service_cost: 0.0533333332,
                  ARN: "snapshot/snap-0d41d8f3eb81b36b3",
                  Tags: {
                    user_name: "vb-OKR-Staging(cleaned)",
                  },
                },
                {
                  service_cost: 0.00015624900000000001,
                  ARN: "snapshot/snap-00999fec401d05ada",
                  Tags: {
                    user_name: "oneplace-prod-volume",
                  },
                },
                {
                  service_cost: 0.0030891928,
                  ARN: "snapshot/snap-0d719ab88965b8512",
                  Tags: {},
                },
                {
                  service_cost: 0.0533333332,
                  ARN: "snapshot/snap-0c2904c67add6164a",
                  Tags: {
                    user_name: "Mautic",
                  },
                },
                {
                  service_cost: 0.0533333332,
                  ARN: "snapshot/snap-06251a9056a2d8ef6",
                  Tags: {
                    user_name: "Excetra",
                  },
                },
                {
                  service_cost: 0.0441634116,
                  ARN: "snapshot/snap-0145b90295a7a2d7f",
                  Tags: {
                    user_name: "new-erp",
                  },
                },
                {
                  service_cost: 0.41800000000000104,
                  ARN: "vol-05125692da48ca3d3",
                  Tags: {
                    user_environment: "Production",
                    user_name: "Accessibility Checker PROD",
                  },
                },
                {
                  service_cost: 0.0566243488,
                  ARN: "snapshot/snap-0af1e6f788cdf8a99",
                  Tags: {
                    user_name: "oneplace-prod-snapshot",
                  },
                },
                {
                  service_cost: 0.13933333700000014,
                  ARN: "vol-09b678a20f9daaa83",
                  Tags: {},
                },
                {
                  service_cost: 0.2786666629999997,
                  ARN: "vol-0667002ddde36b1b4",
                  Tags: {},
                },
                {
                  service_cost: 0.0348144532,
                  ARN: "snapshot/snap-011705d9a89ba01fe",
                  Tags: {
                    user_environment: "Development",
                    user_name: "PerformXcel-SnapShot",
                  },
                },
                {
                  service_cost: 0.13933333700000014,
                  ARN: "vol-0acde5328dd564a87",
                  Tags: {},
                },
                {
                  service_cost: 0.0331966144,
                  ARN: "snapshot/snap-05bec7ed6b805a4d7",
                  Tags: {
                    user_environment: "Development",
                    user_name: "Five9-SFTP-server-ubuntu-SnapShot",
                  },
                },
                {
                  service_cost: 0.34833333699999913,
                  ARN: "vol-00aacdd853de9383c",
                  Tags: {
                    user_environment: "Production",
                    user_name: "OptiWave.Cloud-PROD",
                  },
                },
                {
                  service_cost: 0.13933333700000014,
                  ARN: "vol-0d3b6c74cbd4e57e0",
                  Tags: {},
                },
                {
                  service_cost: 0.13933333700000014,
                  ARN: "vol-08256b4be98647c4f",
                  Tags: {
                    user_environment: "Development",
                    user_name: "OptiWave.Cloud-DEV",
                  },
                },
                {
                  service_cost: 0.20900000000000052,
                  ARN: "vol-0384835c243dfa1fb",
                  Tags: {
                    user_environment: "Development",
                    user_name: "Accessibility Checker DEV",
                  },
                },
                {
                  service_cost: 0.054547526,
                  ARN: "snapshot/snap-05d1e0ddcd4019b8f",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0.0414127604,
                  ARN: "snapshot/snap-06a60c8d9286941d3",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonECR",
          total_cost: "0.02",
          usage_cost: "0.02",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0.013477926000000022,
                  ARN: "repository/oneplace-qa",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0.0023508500000000024,
                  ARN: "repository/oneplace",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonECS",
          total_cost: "3.68",
          usage_cost: "3.12",
          tax_cost: "0.56",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 1.3315108158999993,
                  ARN: "task/one-place/7c2e08619f1748c1bbe319d11b09978f",
                  Tags: {},
                },
                {
                  service_cost: 0.2077261488,
                  ARN: "task/one-place/430c5c41311e4b018b4b1a821140d384",
                  Tags: {},
                },
                {
                  service_cost: 0.22734817280000005,
                  ARN: "task/one-place/000cceeb339646279f60a92ead8cbf36",
                  Tags: {},
                },
                {
                  service_cost: 0.9884557946999993,
                  ARN: "task/one-place/f823f0cf7bc94ee79d90a14845bc3e84",
                  Tags: {},
                },
                {
                  service_cost: 0.3628719284000001,
                  ARN: "task/one-place/7627e5a019874e1da1d8903a09114bd5",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonRDS",
          total_cost: "3.72",
          usage_cost: "3.15",
          tax_cost: "0.57",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 3.1485416626999947,
                  ARN: "optiwave-cloud",
                  Tags: {
                    user_environment: "Development and Production",
                    user_name: "OptiWave.Cloud",
                  },
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonRoute53",
          total_cost: "4.72",
          usage_cost: "4.00",
          tax_cost: "0.72",
          Details: [
            {
              regionID: "global",
              regionDetails: [
                {
                  service_cost: 0.50003,
                  ARN: "hostedzone/Z05036322WYH1CXMF5VCU",
                  Tags: {},
                },
                {
                  service_cost: 0.50032,
                  ARN: "hostedzone/Z1024326DRHSXW8B292X",
                  Tags: {},
                },
                {
                  service_cost: 0.50009,
                  ARN: "hostedzone/Z09650292HYA3R6XSAO8P",
                  Tags: {},
                },
                {
                  service_cost: 0.5,
                  ARN: "hostedzone/Z03466572RXJ80G17I01W",
                  Tags: {},
                },
                {
                  service_cost: 0.50015,
                  ARN: "hostedzone/Z07322291DXKNM4ZLCMJF",
                  Tags: {},
                },
                {
                  service_cost: 0.5,
                  ARN: "hostedzone/Z030275226R5CN2HAENT1",
                  Tags: {},
                },
                {
                  service_cost: 0.5,
                  ARN: "hostedzone/Z00554256U3RY2JLOBRK",
                  Tags: {},
                },
                {
                  service_cost: 0.5,
                  ARN: "hostedzone/Z053616110HOLK921E49A",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonS3",
          total_cost: "0.04",
          usage_cost: "0.03",
          tax_cost: "0.01",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0.00031460000000000006,
                  ARN: "billing-report-vb",
                  Tags: {},
                },
                {
                  service_cost: 0.0000121,
                  ARN: "performance-management-production",
                  Tags: {},
                },
                {
                  service_cost: 0.001243682,
                  ARN: "trelo",
                  Tags: {},
                },
                {
                  service_cost: 0.00001114,
                  ARN: "dxp.oneplace.valuebound.net",
                  Tags: {},
                },
                {
                  service_cost: 0.000071166,
                  ARN: "test-five9-presigned-url",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "aws-cloudtrail-logs-713496944077-42f922cd",
                  Tags: {},
                },
                {
                  service_cost: 0.00050103,
                  ARN: "okr-web",
                  Tags: {},
                },
                {
                  service_cost: 0.0000252,
                  ARN:
                    "amqp-microservice-prod-serverlessdeploymentbucket-1tm048jhywrrb",
                  Tags: {},
                },
                {
                  service_cost: 0.00026794000000000004,
                  ARN: "trelo-local",
                  Tags: {},
                },
                {
                  service_cost: 0.00001,
                  ARN: "digital-experience-platform",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "cf-templates-1920c5au15rdg-ap-south-1",
                  Tags: {},
                },
                {
                  service_cost: 0.0017900348,
                  ARN: "mmlab-class-videos",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "grl-content-migration",
                  Tags: {},
                },
                {
                  service_cost: 0.000002,
                  ARN: "optiwave-template",
                  Tags: {
                    user_environment: "Development / QA / Staging / Production",
                    user_name: "Optiwave.Cloud",
                  },
                },
                {
                  service_cost: 0.0025498352,
                  ARN: "octiwave-parquet-test-v1",
                  Tags: {
                    user_environment: "RnD_test",
                    user_name: "octiwave.cloud.test",
                  },
                },
                {
                  service_cost: 0,
                  ARN: "test-server-pmt",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "pranav-application",
                  Tags: {
                    user_name: "pranav-application",
                  },
                },
                {
                  service_cost: 0.00000768,
                  ARN: "performance-management",
                  Tags: {},
                },
                {
                  service_cost: 0.000178956,
                  ARN: "vbdrupalmarketplace",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "digital-experience-platef-serverlessdeploymentbuck-ncjbmlstzmba",
                  Tags: {},
                },
                {
                  service_cost: 0.0172024612,
                  ARN: "vb-erp",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "mytestbucket-vb",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "aws-cloudtrail-logs-713496944077-14c7961e",
                  Tags: {},
                },
              ],
            },
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0.000030000000000000004,
                  ARN: "optiwave-cur-report854109152",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "lambda-test-dev-serverlessdeploymentbucket-1se5vmpurtqa3",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "okr-web",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "aws-node-dev-serverlessdeploymentbucket-15e43hu6nuapg",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "digital-experience-platef-serverlessdeploymentbuck-ncjbmlstzmba",
                  Tags: {},
                },
                {
                  service_cost: 0.0032030164,
                  ARN: "american-heritage",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "mytestbucket-vb",
                  Tags: {},
                },
                {
                  service_cost: 0.0008883999999999999,
                  ARN: "economize-cur-da409607-6f03-4c69-ace2-adf66e9c4e13",
                  Tags: {},
                },
                {
                  service_cost: 0.00062,
                  ARN: "",
                  Tags: {},
                },
                {
                  service_cost: 0.00052158,
                  ARN: "optiwave-cur-report115999362",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "test-five9-presigned-url",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN:
                    "amqp-microservice-prod-serverlessdeploymentbucket-1tm048jhywrrb",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "pmt-letters",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "performance-management-production",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "octiwave-parquet-test-v1",
                  Tags: {
                    user_environment: "RnD_test",
                    user_name: "octiwave.cloud.test",
                  },
                },
                {
                  service_cost: 0.000412488,
                  ARN: "serverless-drupal",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "test-server-pmt",
                  Tags: {},
                },
                {
                  service_cost: 0.00026801200000000004,
                  ARN: "projects-to-sheets-bucket",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "performance-management",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "vbdrupalmarketplace",
                  Tags: {},
                },
                {
                  service_cost: 0.000192716,
                  ARN: "serverless-123-test",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "aws-cloudtrail-logs-713496944077-14c7961e",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "billing-report-vb",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "mmlab-class-videos",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "optiwave-template",
                  Tags: {
                    user_environment: "Development / QA / Staging / Production",
                    user_name: "Optiwave.Cloud",
                  },
                },
                {
                  service_cost: 0,
                  ARN: "vb-erp",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "digital-experience-platform",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "cf-templates-1920c5au15rdg-ap-south-1",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "trelo-local",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "trelo",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "pranav-application",
                  Tags: {
                    user_name: "pranav-application",
                  },
                },
                {
                  service_cost: 0,
                  ARN: "aws-cloudtrail-logs-713496944077-42f922cd",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "grl-content-migration",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonSNS",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "Default_CloudWatch_Alarms_Topic",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "AmazonVPC",
          total_cost: "8.90",
          usage_cost: "7.54",
          tax_cost: "1.36",
          Details: [
            {
              regionID: "ap-south-1",
              regionName: "Mumbai",
              regionDetails: [
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-0a3b2d28b192258e3",
                  Tags: {},
                },
                {
                  service_cost: 0.07930416500000001,
                  ARN: "network-interface/eni-0b0b20ecd589a8393",
                  Tags: {},
                },
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-0049a912b0f749e06",
                  Tags: {},
                },
                {
                  service_cost: 0.086781945,
                  ARN: "network-interface/eni-08d57f91b09534f60",
                  Tags: {},
                },
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-0374e370359028433",
                  Tags: {},
                },
                {
                  service_cost: 0.36328750000000026,
                  ARN: "network-interface/eni-00d82d171d8c68cac",
                  Tags: {},
                },
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-0792c5ab9e3b7a62f",
                  Tags: {},
                },
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-07f4a74fb6b6ca4a0",
                  Tags: {},
                },
                {
                  service_cost: 0.5349000000000004,
                  ARN: "network-interface/eni-037afe7b46b7569ed",
                  Tags: {},
                },
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-08386c198b3ed4530",
                  Tags: {},
                },
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-08d7bea5fe59d78a1",
                  Tags: {},
                },
                {
                  service_cost: 0.37789583500000024,
                  ARN: "network-interface/eni-03b32d03cdf2968cd",
                  Tags: {},
                },
                {
                  service_cost: 0.5950000000000004,
                  ARN: "network-interface/eni-068280731f64e32d0",
                  Tags: {},
                },
                {
                  service_cost: 0.5088222200000003,
                  ARN: "network-interface/eni-02152ae016f065b8f",
                  Tags: {},
                },
                {
                  service_cost: 0.2342638900000001,
                  ARN: "network-interface/eni-0f0d7506b7de7f123",
                  Tags: {},
                },
                {
                  service_cost: 0.45103055500000033,
                  ARN: "network-interface/eni-0d7cc3ae8fd8eca60",
                  Tags: {},
                },
                {
                  service_cost: 0.13906250000000003,
                  ARN: "network-interface/eni-0fcc8015f3aab1386",
                  Tags: {},
                },
              ],
            },
          ],
        },
        {
          serviceName: "awskms",
          total_cost: "0.00",
          usage_cost: "0.00",
          tax_cost: "0.00",
          Details: [
            {
              regionID: "us-east-1",
              regionName: "N. Virginia",
              regionDetails: [
                {
                  service_cost: 0,
                  ARN: "",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "key/df47f20d-15a6-4347-8def-7b9bc22a771f",
                  Tags: {},
                },
                {
                  service_cost: 0,
                  ARN: "key/8f164e98-9b1d-4d29-aadd-2186e703ec00",
                  Tags: {},
                },
              ],
            },
          ],
        },
      ];

      setInventoryData(tableDataResponse);
      const stringifiedData = JSON.stringify(tableDataResponse);

      localStorage.setItem("inventoryTableData", stringifiedData);
      let highestCost = 0;
      let highestCostService = null;

      tableDataResponse.forEach((service) => {
        const totalCost = parseFloat(service.total_cost);
        if (totalCost > highestCost) {
          highestCost = totalCost;
          highestCostService = service;
        }
      });
      setHCost(highestCost);
      setHService(highestCostService);
      const sortedServices = tableDataResponse.sort(
        (a, b) => parseFloat(b.total_cost) - parseFloat(a.total_cost)
      );

      const tCost = tableDataResponse.reduce(
        (acc, service) => acc + parseFloat(service.total_cost),
        0
      );

      const taggedCost = tableDataResponse.reduce((acc, service) => {
        // Check if service has non-empty tags
        if (
          Object.keys(service.Details[0]?.regionDetails[0]?.Tags || {}).length >
          0
        ) {
          // Add the cost to accumulator
          return acc + parseFloat(service.total_cost);
        }
        return acc; // Skip this service if tags are empty
      }, 0);

      // Extract top 5 services
      // Extract top 5 services
      const top5Servicess = {};
      let totalCostTop5 = 0; // Initialize total cost of top 5 services to 0
      for (let i = 0; i < Math.min(5, sortedServices.length); i++) {
        const service = sortedServices[i];
        // Remove "Amazon" from service name
        const serviceNameWithoutAmazon = service.serviceName
          .replace(/Amazon/gi, "")
          .trim();
        top5Servicess[serviceNameWithoutAmazon] = parseFloat(
          service.total_cost
        );
        totalCostTop5 += parseFloat(service.total_cost); // Add cost of current service to total
      }

      // this.setState({ top5Services });
      setTop5Services(top5Servicess);
      setTop5Total(totalCostTop5.toFixed(2));
      setDoughnutData({
        labels: Object.keys(top5Servicess),
        datasets: [
          {
            label: "Cost",
            data: Object.values(top5Servicess),
            backgroundColor: bgColors,
            borderWidth: 0,
            borderColor: "#000",
          },
        ],
      });
      setupCharts(
        totalCostTop5.toFixed(2),
        top5Servicess,
        tCost.toFixed(2),
        taggedCost
      );
      setApiHit(false);
    }
  }
  console.log(delayError);
  // console.log(networkInventoryError)

  function updatePresentMonthCost() {
    //check with local storage before fetching
    const presentMontCostData = JSON.parse(
      localStorage.getItem("presentMonthCost")
    );
    if (isLocalStorageDataValid() && presentMontCostData) {
      const previousMonthCost = JSON.parse(
        localStorage.getItem("previousMonthCost")
      );
      const pastOneWeek = JSON.parse(localStorage.getItem("pastOneWeek"));
      const pastThreeMonths = JSON.parse(
        localStorage.getItem("pastThreeMonths")
      );
      const pastOneYear = JSON.parse(localStorage.getItem("pastOneYear"));
      setPresentMonthCost(presentMontCostData);
      setPreviousMonthCost(previousMonthCost);
      setpastWeek(pastOneWeek);
      setPast3Months(pastThreeMonths);
      setPastYear(pastOneYear);
      setSkeleton(false);

      const difference = Math.abs(
        presentMontCostData.cost - previousMonthCost.cost
      );
      const percentageDifference =
        (difference / Math.abs(previousMonthCost.cost)) * 100;
      const differenceInPercentage = Math.trunc(percentageDifference);
      const isProfit =
        parseFloat(presentMontCostData.cost) <
        parseFloat(previousMonthCost.cost);

      setProfit(isProfit);
      setPercentage(differenceInPercentage);

      return;
    }

    //fetch new data from api (static response)

    const response = {
      data: {
        status: "success",
        code: 200,
        cloudType: "Amazon Web Services",
        message: "AWS cost related to 713496944077",
        data: {
          presentmonthCostTillDate: [
            {
              month: "April",
              cost: "42.24",
            },
          ],
          previousMonthCost: [
            {
              month: "March",
              cost: "316.94",
            },
          ],
          last7DaysCostPerDay: [
            {
              date: "2024-03-30",
              cost: "6.15",
            },
            {
              date: "2024-03-31",
              cost: "6.15",
            },
            {
              date: "2024-04-01",
              cost: "16.65",
            },
            {
              date: "2024-04-02",
              cost: "6.54",
            },
            {
              date: "2024-04-03",
              cost: "6.61",
            },
            {
              date: "2024-04-04",
              cost: "6.59",
            },
            {
              date: "2024-04-05",
              cost: "5.84",
            },
          ],
          last3MonthsCostPerWeek: [
            {
              week: "2024-01-01",
              cost: "5.57",
            },
            {
              week: "2024-01-08",
              cost: "42.55",
            },
            {
              week: "2024-01-15",
              cost: "44.44",
            },
            {
              week: "2024-01-22",
              cost: "45.15",
            },
            {
              week: "2024-01-29",
              cost: "111.51",
            },
            {
              week: "2024-02-05",
              cost: "67.21",
            },
            {
              week: "2024-02-12",
              cost: "65.59",
            },
            {
              week: "2024-02-19",
              cost: "59.38",
            },
            {
              week: "2024-02-26",
              cost: "105.17",
            },
            {
              week: "2024-03-04",
              cost: "61.14",
            },
            {
              week: "2024-03-11",
              cost: "62.42",
            },
            {
              week: "2024-03-18",
              cost: "63.68",
            },
            {
              week: "2024-03-25",
              cost: "54.32",
            },
            {
              week: "2024-04-01",
              cost: "42.24",
            },
          ],
          last12MonthsCostPerMonth: [
            {
              month: "2023-04-01",
              cost: "-0.01",
            },
            {
              month: "2023-05-01",
              cost: "753.69",
            },
            {
              month: "2023-06-01",
              cost: "454.77",
            },
            {
              month: "2023-07-01",
              cost: "515.93",
            },
            {
              month: "2023-08-01",
              cost: "474.32",
            },
            {
              month: "2023-09-01",
              cost: "343.07",
            },
            {
              month: "2023-10-01",
              cost: "470.64",
            },
            {
              month: "2023-11-01",
              cost: "350.95",
            },
            {
              month: "2023-12-01",
              cost: "209.10",
            },
            {
              month: "2024-01-01",
              cost: "232.46",
            },
            {
              month: "2024-02-01",
              cost: "311.98",
            },
            {
              month: "2024-03-01",
              cost: "316.94",
            },
            {
              month: "2024-04-01",
              cost: "42.24",
            },
          ],
        },
      },
    };
    const { month, cost } = response.data.data.presentmonthCostTillDate[0];
    const prevMonth = response.data.data.previousMonthCost[0].month;
    const prevCost = response.data.data.previousMonthCost[0].cost;
    const difference = Math.abs(cost - prevCost);
    const percentageDifference = (difference / Math.abs(prevCost)) * 100;
    const differenceInPercentage = Math.trunc(percentageDifference);
    const isProfit = parseFloat(cost) < parseFloat(prevCost);

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
    setSkeleton(false);
  }

  // function updatePresentMonthCost() {
  //   //check with local storage before fetching
  //   const presentMontCostData = JSON.parse(
  //     localStorage.getItem("presentMonthCost")
  //   );
  //   if (isLocalStorageDataValid() && presentMontCostData) {
  //     setPresentMonthCost(presentMontCostData);
  //     return;
  //   }

  //   //fetch new data from api
  //   axios
  //     .get(`${baseUrl}/dashboard/cost`, {
  //       params: {
  //         cloudType: "aws",
  //         accountId: "487484989480",
  //       },
  //       withCredentials: true,
  //       credentials: "include",
  //     })
  //     .then(function (response) {
  //       const { month, cost } = response.data.data.presentmonthCostTillDate[0];
  //       console.log(response.data.data);
  //       setPresentMonthCost({ month: month, cost: cost });
  //       localStorage.setItem(
  //         "presentMonthCost",
  //         JSON.stringify({ month: month, cost: cost })
  //       );

  //       setTopFiveServices(response.data.data);
  //       localStorage.setItem(
  //         "pastThreeMonthsTopServicesUsed",
  //         JSON.stringify(response.data.data.last3MonthsCostPerWeek)
  //       );
  //     })
  //     .catch((error) => {
  //       if (error.message.includes("Network Error")) {
  //         setToastError(true);
  //       } else {
  //         toast.error(`API Error: ${error.message}`);
  //       }
  //     });
  // }

  // Function to calculate the hours difference between two dates
  const calculateHoursDifference = (date1, date2) => {
    const diffInMilliseconds = Math.abs(date2 - date1);
    return Math.floor(diffInMilliseconds / (60 * 60 * 1000));
  };

  useEffect(() => {
    renderChartData(periodType);
    // renderDoughnutData(periodType);
    meanMax();

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
    updateInventoryTable();

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
  }, []);

  const [period, setPeriod] = React.useState(periodType.ONEWEEK);

  useEffect(() => {
    if (toastError) {
      toast.error(`Please try again after some time`);
    }
  }, [toastError]);

  useEffect(() => {
    // Calculate the step value to visually space out the slider
    const step = (max - min) / 100;
    setSliderValues([min, mean, max]);
    setStep(step);
  }, [min, mean, max]);
  function getHighestCostService() {
    //current month
    const highestCostService = topfiveServices[0]?.data[0];
    return highestCostService;
  }

  function renderCostDifferenceElement(previousAmount, presentAmount) {
    const difference = Math.abs(presentAmount - previousAmount);
    const percentageDifference = (difference / Math.abs(previousAmount)) * 100;
    const differenceInPercentage = Math.trunc(percentageDifference);
    const isProfit = presentAmount < previousAmount;
    return (
      <span
        className={
          isProfit ? "profit-percentage-div" : "non-profit-percentage-div"
        }
      >
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {differenceInPercentage || ""}%
          {!isProfit ? (
            <ArrowUpwardOutlined sx={{ fontSize: "16px" }} />
          ) : (
            <ArrowDownwardOutlined sx={{ fontSize: "16px" }} />
          )}
        </span>
      </span>
    );
  }

  function formatNumberToK(amount) {
    if (typeof amount === "string") {
      amount = parseFloat(amount);
    }
    if (!amount) return (0).toFixed(2);

    if (amount >= 1000) {
      return (amount / 1000).toFixed(2) + "k";
    } else {
      return amount.toFixed(2);
    }
  }

  // function renderCostExplorerChart() {
  //   return yAxisData?.length ? (
  //     <Line
  //       width="600px"
  //       height="300px"
  //       data={{
  //         labels: xAxisData,
  //         datasets: [
  //           {
  //             label: chartInformation.label,
  //             data: yAxisData,
  //             backgroundColor: "rgba(211,86,38,0.7)",
  //             borderColor: "rgba(53,74,95,0.7)",
  //             borderWidth: "1",
  //             fill: true,
  //           },
  //         ],
  //       }}
  //       options={{
  //         animation: {
  //           duration: 1000, // Set animation duration in milliseconds
  //           easing: "linear", // Use 'linear' easing for smoother animations
  //         },
  //         scales: {
  //           y: {
  //             stacked: true, // Enable stacking on the y-axis
  //             ticks: {
  //               callback: function (value, index, values) {
  //                 return "$" + value;
  //               },
  //             },
  //           },
  //         },
  //       }}
  //     />
  //   ) : (
  //     <CostExplorerGraphSkeleton />
  //   );
  // }

  // function renderAnalyticChart() {
  //   return chartInformation ? (
  //     <PolarArea
  //       width="300px"
  //       height="300px"
  //       data={{
  //         labels: ["Min", "Max", "Mean"],
  //         datasets: [
  //           {
  //             label: chartInformation.label,
  //             data: [
  //               chartInformation.min,
  //               chartInformation.max,
  //               chartInformation.mean,
  //             ],
  //             backgroundColor: [
  //               "rgba(169, 169, 169, 0.7)",
  //               "rgba(53,74,95,0.7)",
  //               "rgba(230,206,160,0.7)",
  //             ],
  //             borderColor: "white",
  //             borderWidth: "0",
  //           },
  //         ],
  //       }}
  //       options={{
  //         responsive: true,
  //         scales: {
  //           r: {
  //             pointLabels: {
  //               display: true,
  //               centerPointLabels: true,
  //               font: {
  //                 size: 18,
  //               },
  //             },
  //           },
  //         },
  //         plugins: {
  //           legend: {
  //             position: "top",
  //           },
  //           title: {
  //             display: true,
  //             text: `Min: ${
  //               currency + chartInformation.min?.toFixed(2)
  //             }, Max: ${currency + chartInformation.max?.toFixed(2)}, Mean: ${
  //               currency + chartInformation.mean?.toFixed(2)
  //             }`,
  //           },
  //         },
  //       }}
  //     />
  //   ) : (
  //     <CostExplorerPieSkeleton />
  //   );
  // }

  // function renderTopServices() {
  //   const lastThreeMonths = topfiveServices.map((obj) => obj.MonthYear);
  //   const serviceAndCostDataSet = [];
  //   const colorShades = [
  //     "rgba(211,86,38,0.6)",
  //     "rgba(53,74,95,0.4)",
  //     "rgba(230,206,160,0.6)",
  //     "rgba(211,86,38,0.4)",
  //     "rgba(53,74,95,0.7)",
  //   ];
  //   let serviceLabels = topfiveServices.length
  //     ? topfiveServices[0].data
  //         .map((serviceObj) => serviceObj.Service)
  //         .slice(0, 5)
  //     : [];

  //   serviceLabels.forEach((serviceLabel, idx) => {
  //     const costData = topfiveServices.map(
  //       (serviceObj) =>
  //         serviceObj.data.find((obj) => obj.Service === serviceLabel)?.TotalCost
  //     );

  //     const updatedDataSet = {
  //       label: serviceLabel,
  //       data: costData,
  //       backgroundColor: colorShades[idx],
  //     };

  //     serviceAndCostDataSet.push(updatedDataSet);
  //   });
  //   return serviceAndCostDataSet?.length ? (
  //     <Bar
  //       width="500px"
  //       height="350px"
  //       data={{
  //         labels: lastThreeMonths,
  //         datasets: serviceAndCostDataSet,
  //       }}
  //       options={{
  //         scales: {
  //           x: {
  //             stacked: true, // Enable stacking on the x-axis
  //           },
  //           y: {
  //             stacked: true, // Enable stacking on the y-axis
  //             ticks: {
  //               callback: function (value, index, values) {
  //                 return "$" + value;
  //               },
  //             },
  //           },
  //         },
  //         plugins: {
  //           legend: {
  //             display: true,
  //             position: "bottom",
  //           },
  //           title: {
  //             display: true,
  //             text: `Top five service in last three months`,
  //           },
  //         },
  //       }}
  //     />
  //   ) : (
  //     <ServiceAnalyticsGraphSkeleton />
  //   );
  // }

  // function renderPastThreeMonthsCost() {
  //   const pastThreeMonths = pastThreeMonthsCost.length
  //     ? pastThreeMonthsCost.map((obj) => obj.MonthYear)
  //     : [""];

  //   const pastThreeMonthsTotalCost = pastThreeMonthsCost.length
  //     ? pastThreeMonthsCost.map((obj) => obj.TotalCost)
  //     : [0];

  //   return pastThreeMonthsTotalCost?.length ? (
  //     <PolarArea
  //       width="350px"
  //       height="350px"
  //       data={{
  //         labels: pastThreeMonths,
  //         datasets: [
  //           {
  //             data: pastThreeMonthsTotalCost,
  //             backgroundColor: [
  //               "rgba(211,86,38,0.7)",
  //               "rgba(53,74,95,0.7)",
  //               "rgba(230,206,160,0.7)",
  //             ],
  //             borderColor: "black",
  //             borderWidth: "1",
  //             fill: true,
  //           },
  //         ],
  //       }}
  //       options={{
  //         responsive: true,
  //         scales: {
  //           r: {
  //             pointLabels: {
  //               display: true,
  //               centerPointLabels: true,
  //               font: {
  //                 size: 14,
  //               },
  //             },
  //           },
  //         },
  //         plugins: {
  //           legend: {
  //             display: true,
  //             position: "top",
  //           },
  //           title: {
  //             display: true,
  //             text: "Past three months total cost",
  //           },
  //         },
  //       }}
  //     />
  //   ) : (
  //     <ServiceAnalyticsPieSkeleton />
  //   );
  // }

  return (
    <div className="page-wrapper">
      <NewNavbar
        firstName={firstName}
        updateLogin={updateLogin}
        setNetworkInventoryError={setNetworkInventoryError}
        setDelayError={setDelayError}
      />
      <SecondaryBar accountName={accountName} hoursLeft={hoursLeft} />{" "}
      {/* for testing purpose, change to {accountName} later */}
      <div className="dashboard-wrapper">
        <ZoomModal
          open={open}
          setOpen={setOpen}
          data={modaData}
          graphNo={graphNo}
        />

        <div className="aws-cost-container">
          {networkg1Error ? (
            <>
              <div className="aws-cost-wrapper">
                <div className="center-content">
                  {" "}
                  {/* Wrap both logo and Typography */}
                  <div className="error-logo-div">
                    <img
                      src={errorPie}
                      alt="cw-logo"
                      className="error-logo-img"
                    />
                  </div>{" "}
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    component="h1"
                    variant="h5"
                  >
                    Something went wrong
                  </Typography>
                </div>
              </div>
            </>
          ) : skeleton ? (
            <div className="aws-cost-wrapper">
              <TotalCostCardSkeleton />
            </div>
          ) : (
            <div className="aws-cost-wrapper">
              {/* <Grid item xs={4} className="grid-item"> */}
              {/* Content for full-width item */}
              <Box
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "85%",
                  height: "20%",
                }}
              >
                <span style={{ fontFamily: "Poppins, sans-serif" }}>
                  Total Cost - This Month
                </span>
                <Typography
                  sx={{
                    mt: "0",
                    color: "#FF6F1A",
                    textAlign: "left",
                    marginTop: "0.5em",
                    fontFamily: "Poppins, sans-serif", // Set font to Poppins
                  }}
                  component="h4"
                  variant="h4"
                >
                  ${presentMonthCost.cost}/ {presentMonthCost.month}
                </Typography>
                <IconButton
                  color="inherit"
                  aria-label="search"
                  sx={{ marginLeft: "-10px" }}
                >
                  {!profit ? (
                    <span style={{ backgroundColor: "rgba(255, 0, 0, 0.2)" }}>
                      <TrendingUpIcon sx={{ color: "red" }} />
                    </span>
                  ) : (
                    <span style={{ backgroundColor: "rgba(0, 255, 0, 0.2)" }}>
                      <TrendingDownIcon sx={{ color: "green" }} />
                    </span>
                  )}
                </IconButton>

                <span style={{ fontFamily: "Poppins, sans-serif" }}>
                  {percentage}% {profit ? "decrease" : "increase"} in comparison
                  to last month
                </span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      mt: "0",
                      color: "#000000", // Set color to black
                      textAlign: "left",
                      marginTop: "0.5em",
                      fontFamily: "Poppins, sans-serif", // Set font to Poppins
                    }}
                    component="p"
                    variant="p"
                  >
                    Previous Month Cost{" "}
                  </Typography>
                  <Typography
                    sx={{
                      mt: "0",
                      color: "#FF6F1A", // Set color to your desired color
                      textAlign: "left",
                      marginTop: "0.5em",
                      fontFamily: "Poppins, sans-serif", // Set font to Poppins
                      marginLeft: "8px",
                    }}
                    component="p"
                    variant="p"
                  >
                    ${previousMonthCost.cost}
                  </Typography>
                </div>

                <Typography
                  sx={{
                    color: "black",
                    fontFamily: "Poppins, sans-serif", // Set font to Poppins
                    textAlign: "left",
                    marginTop: "2em",
                  }}
                  component="h5"
                  variant="h6"
                >
                  Cost Range Level
                </Typography>
                <Box
                  sx={{ width: "90%", margin: "0 auto", textAlign: "center" }}
                >
                  <div style={{ position: "relative" }}>
                    {/* Start Pointer */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "calc(12% - 10px)", // Center vertically
                        width: "5px",
                        height: "20px",
                        backgroundColor: "black",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          left: 0,
                          marginTop: "-20px",
                          color: "#bbb9b7", // Text color
                          fontFamily: "Poppins, sans-serif", // Font family
                        }}
                      >
                        Min
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          left: 0,
                          marginTop: "25px", // Adjust position to be below pointer
                          // color: "#bbb9b7", // Text color
                          fontFamily: "Poppins, sans-serif", // Font family
                          fontStyle: "italic", // Light italic
                          fontSize: "15px", // Smaller font size
                          color: "#6a757f",
                        }}
                      >
                        ${min}
                      </div>
                    </div>
                    {/* Middle Pointer - Triangle */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        top: "calc(30% - 10px)", // Center vertically
                        width: 0,
                        height: 0,
                        borderTop: "20px solid #ff6f1a", // Adjust height as needed
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          transform: "translate(-50%, 0)",
                          textAlign: "center",
                          marginTop: "-40px",
                          color: "#ff6f1a", // Text color
                          fontFamily: "Poppins, sans-serif", // Font family
                        }}
                      >
                        Avg
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          transform: "translate(-50%, 0)",
                          textAlign: "center",
                          marginTop: "5px", // Adjust position to be below pointer
                          // color: "#ff6f1a", // Text color
                          fontFamily: "Poppins, sans-serif", // Font family
                          fontStyle: "italic", // Light italic
                          fontSize: "15px", // Smaller font size
                          color: "#6a757f",
                        }}
                      >
                        ${mean}
                      </div>
                    </div>
                    {/* End Pointer */}
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(12% - 10px)", // Center vertically
                        width: "5px",
                        height: "20px",
                        backgroundColor: "black",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          right: 0,
                          marginTop: "-20px",
                          color: "#bbb9b7", // Text color
                          fontFamily: "Poppins, sans-serif", // Font family
                        }}
                      >
                        Max
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          right: 0,
                          marginTop: "25px", // Adjust position to be below pointer
                          // color: "#bbb9b7", // Text color
                          fontFamily: "Poppins, sans-serif", // Font family
                          fontStyle: "italic", // Light italic
                          fontSize: "15px", // Smaller font size
                          color: "#6a757f",
                        }}
                      >
                        ${max}
                      </div>
                    </div>
                    {/* Horizontal Line */}
                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        backgroundColor: "#EEEFF2",
                        marginTop: "35px",
                        borderRadius: "5px", // Adjust the radius value as needed
                        border: "1px solid #c6c7ca", // Border color #c6c7ca
                      }}
                    ></div>
                  </div>
                  {/* <Slider
                    value={sliderValues}
                    step={step}
                    min={min}
                    max={max}
                    size="small"
                    marks={[
                      {
                        value: min,
                        label: (
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            Min: ${min}
                          </Typography>
                        ),
                      },
                      {
                        value: mean,
                        label: (
                          <Typography
                            sx={{
                              fontSize: 13,
                              mt: -6,
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            Avg: ${mean}
                          </Typography>
                        ),
                        labelPlacement: "top",
                      },
                      {
                        value: max,
                        label: (
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            Max: ${max}
                          </Typography>
                        ),
                      },
                    ]}
                    valueLabelDisplay="auto"
                    aria-labelledby="value-slider"
                    disabled
                    sx={{ width: "100%", marginTop: "20px" }}
                  /> */}
                </Box>
              </Box>
              {/* </Grid> */}
            </div>
          )}
          {networkg1Error ? (
            <>
              <div className="top-service-cost-wrapper">
                <div className="center-content">
                  {" "}
                  {/* Wrap both logo and Typography */}
                  <div className="error-logo-div">
                    <img
                      src={errorGraph}
                      alt="cw-logo"
                      className="error-logo-img"
                    />
                  </div>{" "}
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    component="h1"
                    variant="h5"
                  >
                    Something went wrong
                  </Typography>
                </div>
              </div>
            </>
          ) : skeleton ? (
            <div className="top-service-cost-wrapper">
              <CostExplorerPieSkeleton />
            </div>
          ) : (
            <div className="top-service-cost-wrapper">
              {/* <div className="top-w-title">Cost Summary</div> */}

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
                  sx={{ mb: 1, mt: 1 }}
                  alignItems="center"
                  justifyContent="space-between"
                  width="90%"
                  className="cost-explorer-stack"
                >
                  <Typography
                    sx={{
                      mt: "0",
                      ml: 5,
                      textAlign: "left",
                      fontFamily: "Poppins, sans-serif", // Set font to Poppins
                    }}
                    component="p"
                    variant="p"
                  >
                    Cost Explorer
                  </Typography>
                  <FormControl>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={periodType}
                      onChange={(e) => renderChartData(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <IconButton
                            size="small"
                            style={{ pointerEvents: "none" }}
                          >
                            <CalendarMonthIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      }
                      style={{ fontSize: "small" }} // Adjusting font size of the Select component
                    >
                      <MenuItem value="ONEWEEK">Last one week</MenuItem>
                      <MenuItem value="THREEMONTHS">Last 3 months</MenuItem>
                      <MenuItem value="ONEYEAR">Last 12 months</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Divider
                  orientation="vertical"
                  sx={{
                    backgroundColor: "grey",
                    height: "1%",
                    width: "auto",
                    marginTop: "2%",
                  }}
                ></Divider>
                <LineChart
                  data={data}
                  options={options}
                  width="650px"
                  height="280px"
                  id="line-graph"
                />{" "}
              </Box>
            </div>
          )}
        </div>
        <div className="aws-cost-container bottom-container">
          {networkInventoryError ? (
            <>
              <div
                className="top-service-cost-wrapper"
                style={{ height: "294px" }}
              >
                <div className="center-content">
                  {" "}
                  {/* Wrap both logo and Typography */}
                  <div className="error-logo-div">
                    <img
                      src={errorGraph}
                      alt="cw-logo"
                      className="error-logo-img"
                    />
                  </div>{" "}
                  {delayError ? (
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      component="h1"
                      variant="h6"
                    >
                      It will take 1-2 hour to generate inventory data
                    </Typography>
                  ) : (
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      component="h1"
                      variant="h5"
                    >
                      Something went wrong
                    </Typography>
                  )}
                </div>
              </div>
            </>
          ) : apiHit ? (
            <div className="top-service-cost-wrapper">
              <ServiceAnalyticsSkeleton />
            </div>
          ) : (
            <div className="top-service-cost-wrapper">
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
                  sx={{ mb: 2, mt: 2 }}
                  alignItems="center"
                  justifyContent="space-between"
                  width="90%"
                  className="cost-explorer-stack"
                >
                  <Typography
                    sx={{
                      mt: "0",
                      ml: "0",
                      textAlign: "left",
                      fontFamily: "Poppins, sans-serif", // Set font to Poppins
                    }}
                    component="p"
                    variant="p"
                  >
                    Service Analytics
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton size="small" style={{ pointerEvents: "none" }}>
                      <CalendarMonthIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body1">
                      {" "}
                      {presentMonthCost.month}
                    </Typography>
                  </div>
                </Stack>
                <Divider
                  orientation="vertical"
                  sx={{
                    backgroundColor: "grey",
                    height: "1%",
                    width: "auto",
                    marginTop: "2%",
                  }}
                ></Divider>
                {/* <Line
                  data={data}
                  options={options}
                  width="650px"
                  height="280px"
                  id="line-graph"
                />{" "} */}
                {/* Legend */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "100%",
                    height: "21rem",
                  }}
                >
                  <Box
                    sx={{
                      width: "50%",
                      textAlign: "left",
                      height: "fit-content",
                      padding: "1rem",
                      paddingLeft: "2rem !important",
                    }}
                  >
                    {/* Your legend content goes here */}
                    <Typography variant="body1" component="div" gutterBottom>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          fontSize: "1.5rem",
                          color: "#ff6f1a",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        ${hCost}
                      </Typography>
                      <br />
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          fontSize: "1rem",
                          color: "#273646",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Highest-Cost Service
                      </Typography>
                      <br />
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          fontSize: "0.8rem",
                          color: "#a5a1a0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {hService.serviceName}
                      </Typography>
                    </Typography>
                    {/* Ellipses and service names */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginTop: "1rem",
                        flexDirection: "column",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((index, i) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            marginBottom: "0.8rem",
                          }}
                        >
                          <img
                            src={ellipses[i]}
                            alt="cw-logo"
                            height="15px"
                            style={{
                              marginRight: "1rem",
                            }}
                          />
                          <Typography
                            variant="body2"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#a5a1a0",
                              fontSize: "12px",
                            }}
                          >
                            {Object.keys(top5Services)[i]}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Add Services button */}
                    {/* <Button variant="contained" color="primary" style={{ marginTop: '1rem', color: '#273646',
                backgroundColor: '#fff6f0',
                border: '1px solid orange',
                borderRadius: '5px', // Adjust the border radius as needed
                boxShadow: 'none',
                fontWeight: 'bold',
                textTransform: 'none',
                transition: 'background-color 0.3s ease', // Add transition for smooth color change
                "&:hover": {
                  backgroundColor: '#ff6f1a !important', // Change background color on hover
                },
              }}>Add Services</Button> */}
                  </Box>
                  {/* Doughnut Graph */}
                  <Box
                    sx={{
                      width: "50%",
                      textAlign: "right",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingRight: "1em",
                    }}
                  >
                    <DoughnutChart
                      data={doughnutData}
                      options={doughnutOptions}
                      width={330}
                      height={400}
                      className="dashboard-doughnut"
                    />
                  </Box>
                </Box>
              </Box>
            </div>
          )}
          {networkInventoryError ? (
            <div className="aws-cost-wrapper-2">
              <div className="center-content">
                {" "}
                {/* Wrap both logo and Typography */}
                <div className="error-logo-div">
                  <img
                    src={errorPie}
                    alt="cw-logo"
                    className="error-logo-img"
                  />
                </div>{" "}
                {delayError ? (
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    component="h1"
                    variant="h6"
                  >
                    It will take 1-2 hour to generate inventory data
                  </Typography>
                ) : (
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    component="h1"
                    variant="h5"
                  >
                    Something went wrong
                  </Typography>
                )}
              </div>
            </div>
          ) : apiHit ? (
            <div className="aws-cost-wrapper-2">
              <CostByServiceSkeleton />
            </div>
          ) : (
            <div className="aws-cost-wrapper-2">
              <Box
                sx={{
                  marginLeft: "0",
                  marginRight: "0",
                  width: "100%",
                  height: "5%",
                }}
              >
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ mb: 2, mt: 2 }}
                  alignItems="center"
                  justifyContent="space-between"
                  width="90%"
                  className="cost-explorer-stack"
                >
                  <Typography
                    sx={{
                      mt: "0",
                      ml: "0",
                      textAlign: "left",
                      fontFamily: "Poppins, sans-serif", // Set font to Poppins
                    }}
                    component="p"
                    variant="p"
                  >
                    Cost by Service
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton size="small" style={{ pointerEvents: "none" }}>
                      <CalendarMonthIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body1">
                      {" "}
                      {presentMonthCost.month}
                    </Typography>
                  </div>
                  {/* <FormControl>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value="ONEYEAR"
                      disabled={true} // Setting disabled prop to true
                      onChange={(e) => renderChartData(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <IconButton
                            size="small"
                            style={{ pointerEvents: "none" }}
                          >
                            <CalendarMonthIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      }
                      style={{ fontSize: "small" }} // Adjusting font size of the Select component
                    >
                      <MenuItem value="ONEYEAR">
                        {presentMonthCost.month}
                      </MenuItem>
                    </Select>
                  </FormControl> */}
                </Stack>
                <Divider
                  orientation="vertical"
                  sx={{
                    backgroundColor: "grey",
                    height: "1px",
                    width: "auto",
                    marginTop: "3.5%",
                  }}
                ></Divider>
                <DashboardTable data={inventoryData} />
              </Box>
            </div>
          )}
        </div>
        <FooterCopyright
          color="#FF6F1A"
          leftSpace="0% !important"
          width="90%"
          centralize={true}
          type="product"
          nonSticky={true}
        />
      </div>
    </div>
  );
}

export default Dashboard;
