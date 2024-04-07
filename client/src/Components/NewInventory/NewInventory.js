import React, { useEffect, useState, useRef } from "react";
import "./NewInventory.css";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import PublicIcon from "@mui/icons-material/Public";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import indFlag from "../../Assets/ind-flagCircle.png";
import usaFlag from "../../Assets/usa-flagCircle.png";
import fraFlag from "../../Assets/fran.png";
import indonFlag from "../../Assets/indon.png";
import ireFlag from "../../Assets/irel.png";
import isrFlag from "../../Assets/isr.png";
import italyFlag from "../../Assets/italy.png";
import jpnFlag from "../../Assets/japan.png";
import korFlag from "../../Assets/kor.png";
import singFlag from "../../Assets/sing.png";
import soutFlag from "../../Assets/south.png";
import spaFlag from "../../Assets/spa.png";
import sweFlag from "../../Assets/swe.png";
import swiFlag from "../../Assets/swi.png";
import uaeFlag from "../../Assets/uae.png";
import ukFlag from "../../Assets/united-kingdom.png";
import ausFlag from "../../Assets/aus.png";
import bahFlag from "../../Assets/bah.png";
import brazilFlag from "../../Assets/brazil.png";
import canadaFlag from "../../Assets/canada.png";
import chinaFlag from "../../Assets/china.png";
import globeFlag from "../../Assets/cw-globe.png";
import download from "../../Assets/download_cloud.png";

//mui select
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Box, Modal } from "@mui/material";
import { Close, Rotate90DegreesCcwOutlined } from "@mui/icons-material";
//axios
import axios from "axios";

//chart js
import { toast } from "react-toastify";
import { baseUrl} from "../../constants";
import errorPie from "../../Assets/cw-pieError.png";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { usernameSelector } from "../../redux/_selectors/authSelector";
import { logout as logoutAction } from "../../redux/_actions/logoutAction";
import { useActions } from "../../Utils";
import InventoryTable from "../Inventory/InventoryTable";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ServiceFilter from "../Button/ServiceFilter";
import NameFilter from "../Button/NameFilter";
import CostFilter from "../Button/CostFilter";
import RangeFilter from "../Button/RangeFilter";
import NewNavbar from "../NewNavbar/NewNavbar";
import SecondaryBar from "../SecondaryBar/SecondaryBar";
import { accountNameSelector } from "../../redux/_selectors/authSelector";
import RotateRight from "@mui/icons-material/RotateRight";
import Error from "@mui/icons-material/Error";
import LinearProgress from "@mui/material/LinearProgress";
import FooterCopyright from "../FooterCopyright/FooterCopyright";
import { Skeleton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import setupCharts from "../../Utils/setupCharts";
import DoughnutChart from "../Charts/DoughnutChart";
import BarChart from "../Charts/BarChart";


function NewInventory({ updateLogin,setInventoryData,apiHit, inventoryData,delayError,
  setDelayError,
  networkInventoryError,
  setNetworkInventoryError }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState([]);
  const [totalCost, setTotalCost] = useState();
  const [usageCost, setUsageCost] = useState();
  const [taxCost, setTaxCost] = useState();
  const [sumTagedCost, setSumTagedCost] = useState();
  const [sumTotalRegion, setSumTotalRegion] = useState();
  const [sumResource, setSumResource] = useState();
  const [userName, setUserName] = useState(useSelector(usernameSelector));
  const firstName = userName?.split(" ")[0];
  const [logout] = useActions([logoutAction]);
  const [sliderValues, setSliderValues] = useState({});
  const [showFilterBtn, setShowFilterBtn] = useState(false);
  const [filt, setFilt] = useState({
    items: [],
  });
  const [accountName, setAccountName] = useState(
    useSelector(accountNameSelector)
  );
  const [exporting, setExporting] = useState(false); // State to track export progress
  const [sort, setSort] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filterNo, setFilterNo] = useState(0);
  const [viewMore, setViewMore] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const containerRef = useRef(null);
  const scrollStep = 100; // Adjust as needed
  const [topServiceCost, setTopServiceCost] = useState({
    labels: [],
    datasets: [
      {
        label: "Past Week",
        borderColor: "#FF6F1A",
        data: [],
        fill: false,
      },
    ],
  });
  const [highestCostByRegion, setHighestCostByRegion] = useState({});

  let [count, setCount] = useState(0);

  const getData = (service, serviceName, region, cost) => {
    return { service, serviceName, region, cost };
  };
  const [tableRows, setTableRows] = useState([]);



  //just get 3 of each service for now so ui can be built
  useEffect(() => {
    for (let service of tableData) {
      let count = 0;
      for (let serviceType of service.Details) {
        setTableRows((currRows) => {
          return [
            ...currRows,
            getData(
              service.serviceName,
              service.serviceName,
              serviceType.regionName,
              serviceType.service_cost
            ),
          ];
        });
        count += 1;
        if (count === 3) break;
      }
    }
  }, [tableData]);

  const [loading, setLoading] = useState(apiHit);

  // const renderRows = () => {
  //   const slicedData = tableRows.slice(
  //     page * rowsPerPage,
  //     (page + 1) * rowsPerPage
  //   );
  //   return slicedData.map((row, idx) => (
  //     <TableRow
  //       key={crypto.randomUUID()}
  //       sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
  //     >
  //       <TableCell component="th" scope="row">
  //         {page * rowsPerPage + idx + 1}
  //       </TableCell>
  //       <TableCell align="center">{row.service}</TableCell>
  //       <TableCell align="center">{row.serviceName}</TableCell>
  //       <TableCell align="center">{row.region}</TableCell>
  //       <TableCell align="center" id="cost-cell">
  //         $ {row.cost}
  //       </TableCell>
  //     </TableRow>
  //   ));
  // };

  //dummy data. need to process the api response to convert to this format...

  const inventoryTableStyle = {
    flex: viewMore ? 0.7 : 1, // Adjust the width based on whether the detailed view is open
    transition: "flex 0.3s ease", // Add transition for smooth animation
    width: "85%",
  };


  // const bardata = {
  //   labels: [
  //     "Learning Tool",
  //     "Krypton",
  //     "VB-Application",
  //     "Fenesta",
  //     "ChatGPT-SLB",
  //   ],
  //   datasets: [
  //     {
  //       label: "Top 7 Services by Cost",
  //       backgroundColor: "#41b8d5",
  //       borderColor: "#41b8d5",
  //       borderWidth: 1,
  //       hoverBackgroundColor: "rgba(75,192,192,0.4)",
  //       hoverBorderColor: "rgba(75,192,192,1)",
  //       data: [14, 12, 4, 14, 8],
  //     },
  //   ],
  // };

  const baroptions = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
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
          label: function(context) {
            let label = '';
            label += '$' + context.parsed.y;
            return label;
          },
        },
      },
    }
  };

  const doughnutData = {
    "Tagged Cost": sumTagedCost,
    "Untagged Cost": totalCost - sumTagedCost,
  };
  // const total = doughnutData["Tagged Cost"] + doughnutData["Untagged Cost"];
  const percentageData = [
    ((doughnutData["Tagged Cost"] / totalCost) * 100).toFixed(1),
    ((doughnutData["Untagged Cost"] / totalCost) * 100).toFixed(1),
  ];

  const doughnut = {
    labels: Object.keys(doughnutData),
    datasets: [
      {
        data: percentageData,
        backgroundColor: ["#E8713C", "#273646"],
        borderWidth: 0,
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
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = '';
            label += context.parsed + '%';
            return label;
          },
        },
      },
    },
  };

  function isLocalStorageDataValid() {
    const data = JSON.parse(localStorage.getItem("inventoryTableData")) || [""];
    const validExistingData = !!localStorage.getItem("inventoryTableData");
    const currentTime = new Date().getTime();
    const prevTimestamp = localStorage.getItem("inventoryTimestamp");
    //is invalid, if the prev timestamp exceeds one hour || empty array
    if (
      data?.length === 0 ||
      !prevTimestamp ||
      currentTime - prevTimestamp > 3600000 ||
      !validExistingData
    ) {
      return false;
    } else return true;
  }
  function updateInventoryTable() {
    //check with local storage before fetching
    const tableDataResponse = JSON.parse(
      localStorage.getItem("inventoryTableData")
    );
    if (tableDataResponse) {
      setTableData(tableDataResponse);
      setLoading(false);
      const tCost = tableDataResponse.reduce(
        (acc, service) => acc + parseFloat(service.total_cost),
        0
      );

      const uCost = tableDataResponse.reduce(
        (acc, service) => acc + parseFloat(service.usage_cost),
        0
      );
      setUsageCost(uCost);
      const taxCost = tableDataResponse.reduce(
        (acc, service) => acc + parseFloat(service.tax_cost),
        0
      );
      setTaxCost(taxCost);
      const stringifiedData = JSON.stringify(tableDataResponse);
      localStorage.setItem("inventoryTableData", stringifiedData);
      setTotalCost(tCost);
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
      setSumTagedCost(taggedCost.toFixed(2));
      // console.log(`Sum of Service Cost with Tags: ${sumServiceCostWithTags.toFixed(2)}`);

      const uniqueRegions = new Set();

      tableDataResponse.forEach((service) => {
        service.Details.forEach((detail) => {
          const regionName = detail.regionName;
          if (regionName) {
            uniqueRegions.add(regionName);
          }
        });
      });

      const totalUniqueRegions = uniqueRegions.size;

      // console.log(`Total number of unique regions: ${totalUniqueRegions}`);
      setSumTotalRegion(totalUniqueRegions);

      let totalResources = 0;

      tableDataResponse.forEach((service) => {
        service.Details.forEach((detail) => {
          totalResources += detail.regionDetails.length;
        });
      });

      setSumResource(totalResources);
      const top5Services = tableDataResponse
        .sort((a, b) => parseFloat(b.total_cost) - parseFloat(a.total_cost))
        .slice(0, 5);

      const labels = top5Services.map((service) =>
        service.serviceName.replace("Amazon", "")
      );
      const costs = top5Services.map((service) =>
        parseFloat(service.total_cost)
      );

      const sortedServices = tableDataResponse.sort(
        (a, b) => parseFloat(b.total_cost) - parseFloat(a.total_cost)
      );

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

      setTopServiceCost({
        labels: labels,
        datasets: [
          {
            label: "Top 5 Services by Cost",
            backgroundColor: "#41B8D5",
            borderColor: "#41B8D5",
            borderWidth: 1,
            hoverBackgroundColor: "#017A98",
            hoverBorderColor: "#017A98",
            data: costs,
          },
        ],
      });

      const sliderValues = {};
      const costByRegion = {};
      
      tableDataResponse.forEach((service) => {
        service.Details.forEach((detail) => {
          let region = detail.regionName || "Global"; // Use "Global" if regionName is undefined
          if (region === "global") region = "Global"; // Convert "global" to "Global" if needed
          detail.regionDetails.forEach((regionDetail) => {
            const cost = parseFloat(regionDetail.service_cost);
            // Accumulate the costs for each region
            costByRegion[region] = (costByRegion[region] || 0) + cost;
          });
        });
      });
      
      setNetworkError(false);
      setHighestCostByRegion(costByRegion);
      
      setupCharts(totalCostTop5.toFixed(2), top5Servicess, tCost.toFixed(2), taggedCost.toFixed(2));
      return;
    }

    //fetch new data from api
    axios
      .get(`${baseUrl}/inventory/service`, {
        params: {
          cloudType: "aws",
          accountId: accountName,
        },
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        const tableDataResponse = response.data.data;
        // console.log(tableDataResponse)
        //update table state

        setTableData(tableDataResponse);
        const tCost = tableDataResponse.reduce(
          (acc, service) => acc + parseFloat(service.total_cost),
          0
        );

        setLoading(false);
        const uCost = tableDataResponse.reduce(
          (acc, service) => acc + parseFloat(service.usage_cost),
          0
        );

        setUsageCost(uCost);
        const taxCost = tableDataResponse.reduce(
          (acc, service) => acc + parseFloat(service.tax_cost),
          0
        );
        setTaxCost(taxCost);
        const stringifiedData = JSON.stringify(tableDataResponse);
        localStorage.setItem("inventoryTableData", stringifiedData);

        setTotalCost(tCost);

        const taggedCost = tableDataResponse.reduce((acc, service) => {
          // Check if service has non-empty tags
          if (
            Object.keys(service.Details[0]?.regionDetails[0]?.Tags || {})
              .length > 0
          ) {
            // Add the cost to accumulator
            return acc + parseFloat(service.total_cost);
          }
          return acc; // Skip this service if tags are empty
        }, 0);
        setSumTagedCost(taggedCost.toFixed(2));
        // console.log(`Sum of Service Cost with Tags: ${sumServiceCostWithTags.toFixed(2)}`);

        const uniqueRegions = new Set();

        tableDataResponse.forEach((service) => {
          service.Details.forEach((detail) => {
            const regionName = detail.regionName;
            if (regionName) {
              uniqueRegions.add(regionName);
            }
          });
        });

        const totalUniqueRegions = uniqueRegions.size;

        // console.log(`Total number of unique regions: ${totalUniqueRegions}`);
        setSumTotalRegion(totalUniqueRegions);

        let totalResources = 0;
        tableDataResponse.forEach((service) => {
          service.Details.forEach((detail) => {
            totalResources += detail.regionDetails.length;
          });
        });
        setSumResource(totalResources);

        const top5Services = tableDataResponse
          .sort((a, b) => parseFloat(b.total_cost) - parseFloat(a.total_cost))
          .slice(0, 5);

        const labels = top5Services.map((service) =>
          service.serviceName.replace("Amazon", "")
        );
        const costs = top5Services.map((service) =>
          parseFloat(service.total_cost)
        );

        setTopServiceCost({
          labels: labels,
          datasets: [
            {
              label: "Top 5 Services by Cost",
              backgroundColor: "#41B8D5",
              borderColor: "#41B8D5",
              borderWidth: 1,
              hoverBackgroundColor: "#017A98",
              hoverBorderColor: "#017A98",
              data: costs,
            },
          ],
        });

        const sortedServices = tableDataResponse.sort(
          (a, b) => parseFloat(b.total_cost) - parseFloat(a.total_cost)
        );
  
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

        const costByRegion = {};
        const sliderValues = {};
        
        tableDataResponse.forEach((service) => {
          service.Details.forEach((detail) => {
            let region = detail.regionName || "Global"; // Use "Global" if regionName is undefined
            if (region === "global") region = "Global"; // Convert "global" to "Global" if needed
            detail.regionDetails.forEach((regionDetail) => {
              const cost = parseFloat(regionDetail.service_cost);
              // Accumulate the costs for each region
              costByRegion[region] = (costByRegion[region] || 0) + cost;
            });
          });
        });
        setNetworkError(false);
        setHighestCostByRegion(costByRegion);
        setupCharts(totalCostTop5.toFixed(2), top5Servicess, tCost.toFixed(2), taggedCost.toFixed(2));
      })
      .catch((error) => {
        console.log(error.response)
        if (
          error.response?.data.message ==
          "It will 1-2 hour to generate inventory data"
        ) {
          console.log("if")
          setDelayError(true);
        } else if (error.message.includes("Network Error")) {
          console.log("else if")
          toast.error(`Please try again after some time`);
          setNetworkInventoryError(true);
          setDelayError(false);

        } else {
          console.log("else")
          toast.error(`API Error: ${error.message}`);
          setNetworkInventoryError(true);
          setDelayError(false);

        }
        setCount(count++);
        setNetworkInventoryError(true);
        setLoading(false);
      });
  }
  const flagDisplay = (city) => {
    if (city.toLowerCase().includes("mumbai")) {
      return indFlag;
    } else if (
      city.toLowerCase().includes("n. virginia") ||
      city.toLowerCase().includes("n. california") ||
      city.toLowerCase().includes("oregon") ||
      city.toLowerCase().includes("ohio")
    ) {
      return usaFlag;
    } else if (city.toLowerCase().includes("cape town")) {
      return soutFlag;
    } else if (city.toLowerCase().includes("hong kong")) {
      return chinaFlag;
    } else if (
      city.toLowerCase().includes("hyderabad") ||
      city.toLowerCase().includes("mumbai")
    ) {
      return indFlag;
    } else if (city.toLowerCase().includes("jakarta")) {
      return indonFlag;
    } else if (
      city.toLowerCase().includes("melbourne") ||
      city.toLowerCase().includes("sydney")
    ) {
      return ausFlag;
    } else if (
      city.toLowerCase().includes("osaka") ||
      city.toLowerCase().includes("tokyo")
    ) {
      return jpnFlag;
    } else if (city.toLowerCase().includes("seoul")) {
      return korFlag;
    } else if (city.toLowerCase().includes("singapore")) {
      return singFlag;
    } else if (
      city.toLowerCase().includes("central") ||
      city.toLowerCase().includes("calgary")
    ) {
      return canadaFlag;
    } else if (city.toLowerCase().includes("frankfurt")) {
      return fraFlag;
    } else if (city.toLowerCase().includes("ireland")) {
      return ireFlag;
    } else if (city.toLowerCase().includes("london")) {
      return ukFlag;
    } else if (
      city.toLowerCase().includes("milan") ||
      city.toLowerCase().includes("rome")
    ) {
      return italyFlag;
    } else if (city.toLowerCase().includes("paris")) {
      return spaFlag;
    } else if (city.toLowerCase().includes("spain")) {
      return spaFlag;
    } else if (city.toLowerCase().includes("stockholm")) {
      return sweFlag;
    } else if (city.toLowerCase().includes("zurich")) {
      return swiFlag;
    } else if (city.toLowerCase().includes("tel aviv")) {
      return isrFlag;
    } else if (city.toLowerCase().includes("bahrain")) {
      return bahFlag;
    } else if (city.toLowerCase().includes("uae")) {
      return uaeFlag;
    } else if (city.toLowerCase().includes("são paulo")) {
      return brazilFlag;
    } else {
      return globeFlag;
    }
  };

const handleExportClick = async () => {
  setExporting(true);

  // Prepare account information
  const accountId = accountName;
  const accountname = userName;

  // Export the data with required fields
  const exportData = tableData.flatMap((serviceData) =>
      serviceData.Details.flatMap((detail) =>
          detail.regionDetails.map((regionDetail) => ({
              ID: regionDetail.ARN || "",
              Name: regionDetail.Tags?.user_name || "",
              Service: serviceData.serviceName,
              ServiceCost: regionDetail.service_cost,
              ARN: regionDetail.ARN || "",
              Region: detail.regionName,
              TotalCost: serviceData.total_cost,
          }))
      )
  );

  // Create a CSV string from the data
  const csvContent =
      "data:text/csv;charset=utf-8," +
      `OPTIWAVE\n\n` + 
      `AccountName,${accountname}\n` + // Account info header row
      `AccountId,${accountId}\n\n\n` + // Account info header row
      "ID,Name,Service,ServiceCost,ARN,Region,TotalCost\n" + // Data header row
      exportData.map((row) => Object.values(row).join(",").replace(/,/g, ",")).join("\n");

  // Create a hidden link to trigger the download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "optiwave.csv");
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
      // Reset exporting state after export is completed
      setExporting(false);
  }, 1000); // Simulated 2 second export process
};




  useEffect(() => {
    Object.entries(highestCostByRegion).forEach(([region]) => {
      const percentage =
        highestCostByRegion[region] > 0
          ? ((highestCostByRegion[region] / totalCost) * 100).toFixed(2)
          : 0.0; // Use toFixed(2) to limit to two digits after the decimal point
      sliderValues[region] = parseFloat(percentage); // Convert back to a floating-point number
      setSliderValues(sliderValues);
    });
  }, [highestCostByRegion]);

  const renderRegionCards = () => {
    return Object.entries(highestCostByRegion).map(([region, highestCost]) => (
      <Box
        sx={{
          width: "100%",
          height: "auto",
          borderBottom: "1px solid grey",
          mt: 1,
          p: "2px",
        }}
        className="region-card-item"
        key={region}
      >
        <Stack
          spacing={2}
          direction="row"
          sx={{}}
          alignItems="flex-start"
          justifyContent="center"
          width="100%"
          className="table-stack"
        >
          {/* Use an appropriate flag or region logo */}
          <img
            src={flagDisplay(region)}
            alt="region-logo"
            height="35px"
            className="circle-flag"
          />
          <div className="region-cost-card-right">
            <Stack
              spacing={2}
              direction="row"
              sx={{}}
              alignItems="flex-start"
              justifyContent="space-between"
              width="100%"
              className=""
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: ".8em",
                  fontWeight: "normal",
                }}
              >
                {region}
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: ".9em",
                  fontWeight: "normal",
                  color: "#FF6F1A",
                  marginBottom: "5px",
                  marginRight: "5px",
                }}
              >
                {sliderValues[region] !== undefined
                  ? `${sliderValues[region].toFixed(2)}%`
                  : "0%"}
              </span>{" "}
            </Stack>
            {/* <Slider
              value={sliderValues[region] || 0}
              // onChange={handleSliderChange(region)}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value.toFixed(2)}%`}
              step={(highestCost.toFixed(2) / totalCost) * 100}
              disabled
            /> */}
            <LinearProgress
              variant="determinate"
              value={sliderValues[region] || 0}
              valueBuffer={parseInt(highestCost.toFixed(2))}
              sx={{
                height: "10px", // Adjust the height as needed
                bgcolor: "#fff6f0", // Background color
                borderRadius: "8px",
                width: "90%",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#FF6F1A", // Progress bar color
                },
              }}
            />
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: ".9em",
                  fontWeight: "normal",
                  marginBottom: "5px",
                  marginRight: "5px",
                }}
                id="highest-cost"
              >
                ${highestCost.toFixed(2)}
              </span>
            </div>
          </div>
        </Stack>
      </Box>
    ));
  };
  const getTagData = () => {
    const tagsData = [
      {
        dataDivElement: (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "left", mt: "5px", ml: "5px" }}>
              <Typography
                sx={{ mt: "2px", fontFamily: "Poppins, sans-serif" }}
                variant="subtitle2"
              >
                Total Cost
              </Typography>
              <Typography
                align="left"
                style={{
                  color: "#ff6f1a",
                  fontWeight: "medium",
                  marginTop: "8px",
                  fontFamily: "Poppins, sans-serif",
                }} // Adjusted margin top here
                variant="h5"
              >
                ${totalCost?.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#fff6f0",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <AccountBalanceWalletOutlinedIcon style={{ color: "grey" }} />
              {/* <img
                src={imgTotalCost}
                alt="Cloud Image"
                style={{ width: "20px", height: "20px", borderRadius: "50%" }}
              /> */}
            </Box>
          </Box>
        ),
      },
      {
        dataDivElement: (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "left", mt: "5px", ml: "5px" }}>
              <Typography
                sx={{ mt: "2px", fontFamily: "Poppins, sans-serif" }}
                variant="subtitle2"
              >
                Usage Cost
              </Typography>
              <Typography
                align="left"
                style={{
                  color: "#ff6f1a",
                  fontWeight: "medium",
                  marginTop: "8px",
                  fontFamily: "Poppins, sans-serif",
                }} // Adjusted margin top here
                variant="h5"
              >
                $ {usageCost?.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#fff6f0",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <MonetizationOnIcon style={{ color: "grey" }} />
            </Box>
          </Box>
        ),
      },
      {
        dataDivElement: (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "left", mt: "5px", ml: "5px" }}>
              <Typography
                sx={{ mt: "2px", fontFamily: "Poppins, sans-serif" }}
                variant="subtitle2"
              >
                Tax Cost
              </Typography>
              <Typography
                align="left"
                style={{
                  color: "#ff6f1a",
                  fontWeight: "medium",
                  marginTop: "8px",
                  fontFamily: "Poppins, sans-serif",
                }} // Adjusted margin top here
                variant="h5"
              >
                $ {taxCost?.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#fff6f0",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              {" "}
              <LocalAtmOutlinedIcon style={{ color: "grey" }} />
            </Box>
          </Box>
        ),
      },
      {
        dataDivElement: (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "left", mt: "5px", ml: "5px" }}>
              <Typography
                sx={{ mt: "2px", fontFamily: "Poppins, sans-serif" }}
                variant="subtitle2"
              >
                Resources
              </Typography>
              <Typography
                align="left"
                style={{
                  color: "#ff6f1a",
                  fontWeight: "medium",
                  marginTop: "8px",
                  fontFamily: "Poppins, sans-serif",
                }} // Adjusted margin top here
                variant="h5"
              >
                {sumResource}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#fff6f0",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <ListAltOutlinedIcon style={{ color: "grey" }} />
            </Box>
          </Box>
        ),
      },
      {
        dataDivElement: (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "left", mt: "5px", ml: "5px" }}>
              <Typography
                sx={{ mt: "2px", fontFamily: "Poppins, sans-serif" }}
                variant="subtitle2"
              >
                Region
              </Typography>
              <Typography
                align="left"
                style={{
                  color: "#ff6f1a",
                  fontWeight: "medium",
                  marginTop: "8px",
                  fontFamily: "Poppins, sans-serif",
                }} // Adjusted margin top here
                variant="h5"
              >
                {sumTotalRegion}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#fff6f0",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <PublicIcon style={{ color: "grey" }} />
            </Box>
          </Box>
        ),
      },
    ];

    return tagsData;
  };
  useEffect(() => {
    // if(!apiHit){
      updateInventoryTable();

    // }
  }, [inventoryData]);
  console.log(networkInventoryError)
  console.log(delayError)

  return (
    <div className="page-wrapper">
      <NewNavbar firstName={firstName} updateLogin={updateLogin} setNetworkInventoryError={setNetworkInventoryError} setDelayError={setDelayError} />
      <SecondaryBar accountName={accountName} hoursLeft={3} />{" "}
      <div className="inventory-wrapper">
        <div className="inventory-main-container">
          <div className="content-wrapper">
          {delayError || networkInventoryError ? (
            <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src={errorPie}
                alt="Your Image"
                style={{ maxWidth: "40%", height: "auto" }}
              />
              {delayError ? (
                <p
                  style={{
                    fontSize: "18px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  It will take 1-2 hours to generate inventory data
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "18px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  something went wrong
                </p>
              )}
            </div>
          </div>
        ) :(

            <Box
              sx={{
                width: "100%",
              }}
              className="main-box"
            >
              <Grid
                container
                columnGap={2}
                rowGap={2}
                sx={{ justifyContent: "center" }}
              >
                <Grid
                  item
                  xs={8}
                  className="new-grid-item"
                  sx={{
                    paddingTop: "0px",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    background: "#FFFFFF",
                  }}
                >
                  <div className="tag-cards-container">
                    {getTagData()?.map((card) => (
                      <div key={card.title} className="tag-card">
                        {loading || networkError ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {loading && <RotateRight className="loading" />}
                            {networkError && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  marginTop: "10px",
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
                          </div>
                        ) : (
                          <div className="tag-card-data-wrapper">
                            <div className="icard-data-div">
                              {card.dataDivElement}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      background: "#ffffff",
                      justifyContent: "flex-start",
                      height: "80%",
                      mt: 2,
                    }}
                  >
                    <Box
                      className="grid-item cost-by-region"
                      sx={{
                        height: "90%",
                        paddingLeft: "1%",
                        paddingRight: "1%",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        width: '35.5%',
                        ml: 0,
                      }}
                    >
                      {loading ? (
                        <div>
                          <div style={{ display: "flex" }}>
                            <div
                              style={{
                                position: "relative",
                                height: "50%",
                                width: "50%",
                                marginTop: "10px",
                                marginLeft: "20px",
                              }}
                            >
                              <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="50%"
                                height="30px"
                              />
                            </div>
                          </div>
                          <Divider style={{ marginTop: "20px" }} />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "20px",
                            }}
                          >
                            <Skeleton
                              variant="rectangular"
                              animation="wave"
                              width="70%"
                              height="250px"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Stack
                            spacing={2}
                            direction="row"
                            sx={{ mb: 1, mt: 0, minHeight: "0px" }}
                            alignItems="flex-start"
                            justifyContent="space-between"
                            width="100%"
                            height="7%"
                            className="cards-container"
                          >
                            <div className="cbr-title">
                              <span
                                style={{
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: "normal",
                                }}
                              >
                                Cost by Region
                              </span>
                            </div>

                          </Stack>
                          <hr
                            style={{
                              borderTop: "1px solid #000000",
                              margin: "10px 0",
                            }}
                          />
                          <div
                            ref={containerRef}
                            style={{
                              overflowY: "auto",
                              overflowX: "hidden",
                              position: "relative",
                              maxHeight: "300px", // Adjust as needed
                            }}
                            id="cbr"
                          >
                            {renderRegionCards()}
                          </div>
                        </>
                      )}
                    </Box>
                    <Box
                      className="grid-item cost-instance-container-grid"
                      sx={{
                        paddingTop: "0px",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        background: "#FFFFFF",
                        height: "96%", // Set height to 100% to fill the grid container
                        width: "57%", // Set width to 100% to fill the grid container
                        marginLeft: "1.5rem"
                      }}
                    >
                      <Box
                        sx={{
                          ml: "5px",
                          width: "95%",
                          height: "80%",
                        }}
                      >
                        {loading ? (
                          <div>
                            <div style={{ display: "flex", marginTop: "20px" }}>
                              <div
                                style={{
                                  position: "relative",
                                  width: "50%",
                                  marginTop: "10px",
                                  marginLeft: "20px",
                                }}
                              >
                                <Skeleton
                                  variant="rectangular"
                                  animation="wave"
                                  width="50%"
                                  height="30px"
                                />
                              </div>
                            </div>
                            <Divider style={{ marginTop: "35px" }} />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                              }}
                            >
                              <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="80%"
                                height="250px"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <Stack
                              spacing={2}
                              direction="row"
                              sx={{ mt: 0, minHeight: "0px" }}
                              alignItems="flex-start"
                              justifyContent="space-between"
                              width="100%"
                              height="0%"
                              className="cost-instance-container"
                            >
                              <div className="cbr-title">
                                <span
                                  style={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: "normal",
                                  }}
                                >
                                  Top 5 Service
                                </span>
                              </div>
                              {/* Additional stack content */}
                            </Stack>
                            <hr
                              style={{
                                borderTop: "1px solid #000000",
                                margin: "10px 0",
                              }}
                            />
                            <BarChart
                              data={topServiceCost}
                              options={{ ...baroptions, responsive: true }} // Make the chart responsive
                              id="bar-graph"
                            />
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={3}
                  className="grid-item"
                  sx={{
                    paddingTop: "0px",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    background: "#ffffff",
                  }}
                >
                  {/* {loading || networkError ? ( */}
                  {loading ? (
                    <div>
                      <div style={{ display: "flex", marginTop: "20px" }}>
                        <div
                          style={{
                            position: "relative",
                            width: "50%",
                            marginTop: "10px",
                            marginLeft: "20px",
                          }}
                        >
                          <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="50%"
                            height="30px"
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "40px",
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          width="80%"
                          height="250px"
                        />
                      </div>

                      {/* Container for the last two skeletons */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          width="40%"
                          height="35px"
                          style={{
                            marginBottom: "10px",
                            marginTop: "25px",
                          }}
                        />
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          width="80%"
                          height="40px"
                          style={{
                            marginBottom: "10px",
                            marginTop: "10px",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    // ) : (
                    //   <div>
                    //     <div
                    //       style={{
                    //         display: "flex",
                    //         justifyContent: "center",
                    //         marginTop: "25%",
                    //         marginLeft: "25%",
                    //         width: "70%",
                    //         height: "70%",
                    //       }}
                    //     >
                    //       <img
                    //         src={errorPie}
                    //         alt="cw-logo"
                    //         className="error-logo-img"
                    //       />
                    //     </div>
                    //   </div>
                    // )
                    <>
                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{ mt: 0, minHeight: "0px", paddingTop: "10px !important", paddingBottom: '0px !important' }}
                        alignItems="flex-start"
                        justifyContent="space-between"
                        width="100%"
                        height="7%"
                        className="cost-instance-container"
                      >
                        <div className="cbr-title">
                          <Typography
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: "normal",
                            }}
                          >
                            Total Cost
                          </Typography>
                        </div>
                        <Stack
                          spacing={2}
                          direction="row"
                          sx={{ mb: 1, mt: 0, minHeight: "0px" }}
                          alignItems="flex-start"
                          justifyContent="flex-start"
                          width="100%"
                        >
                          {/* <IconButton
                  color="inherit"
                  aria-label="search"
                  sx={{ padding: "0 0" }}
                >
                  <SettingsIcon />
                </IconButton>
                <Button
                  color="inherit"
                  sx={{
                    padding: "0",
                    minWidth: "0px",
                    "&:hover": { color: "orange", textDecoration: "underline" },
                  }}
                >
                  All
                </Button>
                <Button
                  color="inherit"
                  sx={{
                    padding: "0",
                    minWidth: "0px",
                    "&:hover": { color: "orange", textDecoration: "underline" },
                  }}
                >
                  1M
                </Button>
                <Button
                  color="inherit"
                  sx={{
                    padding: "0",
                    minWidth: "0px",
                    "&:hover": { color: "orange", textDecoration: "underline" },
                  }}
                >
                  1Y
                </Button> */}
                        </Stack>
                      </Stack>
                      <div style={{width:'100%', display: 'flex', justifyContent: 'center'}}>
                      <hr
                            style={{
                              borderTop: "1px solid #000000",
                              margin: "0",
                              width: '95%',
                            }}
                      />
                      </div>
                      <DoughnutChart
                        data={doughnut}
                        options={optionsDoughnut}
                        width="300px"
                        height="225px"
                        id="line-graph"
                        className="inventory-doughnut"
                      />
                      <Box display="flex" justifyContent="space-between" flexDirection="row" sx={{marginTop:'1.5rem', padding:'1.5rem'}}>
                        {/* Left elements */}
                        <Box display="flex" flexDirection="row" justifyContent="flex-start">
                        <BookmarkIcon style={{ color: "#FF6F1A", marginRight: '8px' }} />
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif", // Set font to Poppins
                            color: "#676767"
                          }}
                          variant="body1"
                        >
                          Tagged Cost
                        </Typography>
                        </Box>
                        {/* Right element */}
                        <Typography
                          sx={{
                            color: "#FF6F1A",

                            fontFamily: "Poppins, sans-serif", // Set font to Poppins
                          }}
                          variant="body1"
                        >
                          $ {sumTagedCost}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" flexDirection="row" sx={{marginTop:'0.5rem', padding:'1.5rem'}}>
                        {/* Left elements */}
                        <Box display="flex" flexDirection="row" justifyContent="flex-start">
                        <BookmarkIcon style={{ color: "#273646", marginRight: '8px' }} />
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif", // Set font to Poppins
                            color: "#676767"
                          }}
                          variant="body1"
                        >
                          Untagged Cost
                        </Typography>
                        </Box>
                        {/* Right element */}
                        <Typography
                          sx={{
                            color: "#FF6F1A",

                            fontFamily: "Poppins, sans-serif", // Set font to Poppins
                          }}
                          variant="body1"
                        >
                          $ {(totalCost - sumTagedCost).toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>
                <Box xs={12} className="tgrid-item " height="auto" sx={{maxWidth: 'none', width: '93%'}}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                    className="table-container-box"
                  >
                    <Stack
                      spacing={2}
                      direction="row"
                      sx={{ mb: 1 }}
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      className="table-stack"
                    >
                      <div style={{ display: "flex" }}>
                        <ServiceFilter
                          setShowFilterBtn={setShowFilterBtn}
                          setFilt={setFilt}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          filterNo={filterNo}
                          setFilterNo={setFilterNo}
                          data={tableData}
                        />
                        <NameFilter
                          setShowFilterBtn={setShowFilterBtn}
                          setFilt={setFilt}
                          sort={sort}
                          setSort={setSort}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          filterNo={filterNo}
                          setFilterNo={setFilterNo}
                        />
                        <CostFilter
                          setShowFilterBtn={setShowFilterBtn}
                          setFilt={setFilt}
                          sort={sort}
                          setSort={setSort}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          filterNo={filterNo}
                          setFilterNo={setFilterNo}
                        />

                        {/* <FilterButton
                          setShowFilterBtn={setShowFilterBtn}
                          setFilt={setFilt}
                          sort={sort}
                          setSort={setSort}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          filterNo={filterNo}
                          setFilterNo={setFilterNo}
                        /> */}
                        {showFilterBtn && (
                          <Tooltip title="Clear filter">
                            <Button
                              sx={{
                                backgroundColor: "#faebdc",
                                color: "#000000",
                                borderColor: "#eeeeee",
                                marginLeft: "12px",
                                padding: "5px 4px 5px 8px",
                                fontSize: "10px",
                                fontWeight: "600",
                                borderRadius: "8px",
                              }}
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                setFilt({
                                  items: [],
                                });
                                setShowFilterBtn(false);
                                setSelectedOption(null);
                                setFilterNo(0);
                              }}
                            >
                              {selectedOption}
                              <HighlightOffIcon
                                sx={{
                                  ml: "4px",
                                  height: "16px",
                                  color: "#000000",
                                }}
                              />
                            </Button>
                          </Tooltip>
                          // <Button
                          //   size="small"
                          //   variant="contained"
                          //   endIcon={<ClearIcon />}
                          //   style={{ marginLeft: "20px" }}
                          //   onClick={() => {
                          //     setFilt({
                          //       items: [],
                          //     });
                          //     setShowFilterBtn(false);
                          //   }}
                          // >
                          //   Clear Filter
                          // </Button>
                        )}
                      </div>
                      <div style={{ display: "flex", marginRight: "20px" }}>
                        <div
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Tooltip title="Export">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={handleExportClick}
                            >
                              {exporting ? (
                                <CircularProgress size={24} sx={{ color: "#FF6F1A" }} />
                              ) : (
                                <img src={download} alt="Export" style={{ width: 25, height: 20 }} />
                                )}
                            </IconButton>
                          </Tooltip>
                        </div>
                        {/* <ServiceFilter
                          setShowFilterBtn={setShowFilterBtn}
                          setFilt={setFilt}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          filterNo={filterNo}
                          setFilterNo={setFilterNo}
                          data={tableData}
                        /> */}
                        {false && (
                          <RangeFilter
                            setShowFilterBtn={setShowFilterBtn}
                            setFilt={setFilt}
                          />
                        )}
                      </div>
                      {/* <div>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={accountSelect}
                    onChange={handleSelect}
                    sx={{
                      marginLeft: "20px",
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid grey",
                    }}
                  >
                    <MenuItem value={0}>Select Service</MenuItem>
                    <MenuItem value={1}>2nd Option</MenuItem>
                    <MenuItem value={2}>3rd Option</MenuItem>
                  </Select>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={accountSelect}
                    onChange={handleSelect}
                    sx={{
                      marginLeft: "20px",
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid grey",
                    }}
                  >
                    <MenuItem value={0}>Name</MenuItem>
                    <MenuItem value={1}>2nd Option</MenuItem>
                    <MenuItem value={2}>3rd Option</MenuItem>
                  </Select>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={accountSelect}
                    onChange={handleSelect}
                    sx={{
                      marginLeft: "20px",
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid grey",
                    }}
                  >
                    <MenuItem value={0}>Cost</MenuItem>
                    <MenuItem value={1}>2nd Option</MenuItem>
                    <MenuItem value={2}>3rd Option</MenuItem>
                  </Select>
                </div> */}
                      {/* <div>
                  <IconButton color="inherit" aria-label="search">
                    <CloudDownloadIcon />
                  </IconButton>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={accountSelect}
                    onChange={handleSelect}
                    sx={{
                      marginLeft: "20px",
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid grey",
                    }}
                  >
                    <MenuItem value={0}>Last Month</MenuItem>
                    <MenuItem value={1}>Last 3 Months</MenuItem>
                    <MenuItem value={2}>Last 12 Months</MenuItem>
                  </Select>
                </div> */}
                    </Stack>
                    <Divider
                      orientation="vertical"
                      sx={{
                        backgroundColor: "grey",
                        height: "1px",
                        width: "100%",
                        marginTop: "2%",
                      }}
                    ></Divider>
                    {/* <Box sx={{ display: "flex" }}> */}
                    {/* Inventory Table */}
                    <Box sx={{ display: "flex" }}>
                      {/* Inventory Table */}
                      <Box sx={inventoryTableStyle}>
                        <InventoryTable
                          filt={filt}
                          data={tableData}
                          skeleton={loading}
                          sort={sort}
                          setViewMore={setViewMore}
                        />
                      </Box>

                      {/* Detailed View */}
                      {viewMore !== null && (
                        <div
                          style={{
                            width: "30%", // Adjust the width of the detailed view
                            borderRadius: "16px",
                            boxShadow: "0px 4px 16px 4px rgba(0, 0, 0, 0.10)",
                            position: "relative",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <Box sx={{ padding: 2, paddingTop: 5 }}>
                            <IconButton
                              sx={{ position: "absolute", right: 0, top: 0 }}
                              onClick={() => {
                                setViewMore(null);
                              }}
                            >
                              <Close />
                            </IconButton>
                            <Typography
                              sx={{
                                marginRight: 1,
                                fontSize: 14,
                                wordBreak: "break-word",
                              }}
                            >
                              {viewMore.tags?.user_name}
                            </Typography>
                            <Typography
                              sx={{
                                marginRight: 1,
                                fontSize: 14,
                                wordBreak: "break-word",
                              }}
                            >
                              {viewMore.tags?.user_environment}
                            </Typography>
                            <Typography
                              sx={{
                                marginRight: 1,
                                fontSize: 14,
                                wordBreak: "break-word",
                              }}
                            >
                              Service: {viewMore.serviceName}
                            </Typography>
                            {/* Other details here */}
                          </Box>
                        </div>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>)}
            <FooterCopyright
              color="#FF6F1A"
              leftSpace="0% !important"
              width="90%"
              centralize={true}
              type="product"
              nonSticky={true}
              topSpace="2rem"
              bottomSpace="2rem"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewInventory;
