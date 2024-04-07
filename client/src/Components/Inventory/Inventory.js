import React, { useEffect, useState } from "react";
import "./Inventory.css";
import InventoryTable from "./InventoryTable";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { baseUrl, currency, inventoryTypes, tabTypes } from "../../constants";
import NavigationTab from "../NavigationTab/NavigationTab";
import FilterButton from "../Button/FilterBtn";
import ServiceFilter from "../Button/ServiceFilter";
import axios from "axios";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { toast } from "react-toastify";
import InventoryCards from "../CardsContainer/InventoryCards";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
import PublicIcon from "@mui/icons-material/Public";
import errorTable from "../../Assets/cw-tableError.png";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Error from "@mui/icons-material/Error";
import RotateRight from "@mui/icons-material/RotateRight";
import InventoryTab from "../Tabs/InventoryTab";
import ZoomModal from "../ZoomModal/ZoomModal";
import { Close, ZoomOutMap } from "@mui/icons-material";
import RangeFilter from "../../Components/Button/RangeFilter";

function Inventory({ updateLogin }) {
  const [activeInventoryTab, setActiveInventoryTab] = useState(
    inventoryTypes.S3
  );
  const [filt, setFilt] = useState({
    items: [],
  });
  const [tableData, setTableData] = useState([]);
  const [showFilterBtn, setShowFilterBtn] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const [sort, setSort] = useState([]);
  const [filterNo, setFilterNo] = useState(0);
  const [open, setOpen] = useState(false);
  const [graphNo, setGraphNo] = useState(0);
  const [modalData, setModalData] = useState();
  const [viewMore, setViewMore] = useState(null);

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [showError, setShowError] = useState(false);
  const [skeleton, setSkeleton] = useState(true);

  const apiRequests = [];
  let [count, setCount] = useState(0);

  const handleChange = (event) => {
    setActiveInventoryTab(event.target.value);
  };
  function formatNumberToK(amount) {
    if (!amount) return (0).toFixed(2);

    if (amount >= 1000) {
      return (amount / 1000).toFixed(2) + "k";
    } else {
      return amount.toFixed(2);
    }
  }

  function getCurrentDate(date) {
    if (date === 1 || date === 21 || date === 31) return date + "st";
    else if (date === 2 || date === 22) return date + "nd";
    else if (date === 3 || date === 23) return date + "rd";
    else return date + "th";
  }
  function getTotalCostWithTagPresence() {
    let totalCost = 0;
    console.log(tableData)
    tableData.forEach((volume) => {
      if (volume.tags?.length > 0) {
        totalCost += parseFloat(volume.cost);
      }
    });

    return totalCost.toFixed(2);
  }
  function getTotalCostWithoutTagPresence() {
    let totalCost = 0;

    tableData.forEach((volume) => {
      if (volume.tags?.length === 0) {
        totalCost += parseFloat(volume.cost);
      }
    });

    return totalCost.toFixed(2);
  }

  const costWithTags = getTotalCostWithTagPresence();
  const costWithoutTags = getTotalCostWithoutTagPresence();

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

  const axiosClientToFetchTableData = (endpoint) => {
    setLoading(true);
    return axios
      .get(baseUrl + endpoint, {
        params: {
          cloudType: 'aws',
          // accountId: '487484989480',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((response) => {
        console.log(response)
        const tableDataResponse = response.data.data;
        console.log(tableDataResponse)
        //update table state
        setTableData((data) => [...data, ...tableDataResponse]);

        //update localStorage data
        const existingData = JSON.parse(
          localStorage.getItem("inventoryTableData")
        );
        const stringifiedData = JSON.stringify([
          ...existingData,
          ...tableDataResponse,
        ]);
        localStorage.setItem("inventoryTableData", stringifiedData);
      })
      .catch((error) => {
        if (error.message.includes("Network Error")) {
          toast.error(`Please try again after some time`);
        } else {
          toast.error(`API Error: ${error.message}`);
        }
        setCount(count++);
      })
      .finally(() => setLoading(false));
  };
  function fetchDataFromApi(apiEndpoint) {
    return axiosClientToFetchTableData(apiEndpoint);
  }
  const fetchTableData = async () => {
    localStorage.setItem("inventoryTableData", "[]");
    apiRequests.push(fetchDataFromApi("/inventory/service"));
    // apiRequests.push(fetchDataFromApi("/s3/all"));
    // apiRequests.push(fetchDataFromApi("/lb/all"));
    // apiRequests.push(fetchDataFromApi("/ec2/all"));
    // apiRequests.push(fetchDataFromApi("/lambda/all"));
    // apiRequests.push(fetchDataFromApi("/efs/all"));
    // apiRequests.push(fetchDataFromApi("/dynamoDB/all"));
    // apiRequests.push(fetchDataFromApi("/ebs/all"));
    // apiRequests.push(fetchDataFromApi("/rds/all"));
    // apiRequests.push(fetchDataFromApi("/cloudFront/all"));
    // set new timestamp
    Promise.all(apiRequests)
      .then((responses) => {
        const currentTime = new Date().getTime();
        localStorage.setItem("inventoryTimestamp", currentTime);
        if (responses?.length <= count) {
          setNetworkError(true);
          setSkeleton(false);
        }
        if (tableData?.length === 0 && count === 0) {
          setSkeleton(false);
        }
        if (JSON.parse(localStorage.getItem("inventoryTableData"))?.length > 0) {
          setSkeleton(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (isLocalStorageDataValid()) {
      setSkeleton(false);
      setTableData(JSON.parse(localStorage.getItem("inventoryTableData")));
    } else {
      fetchTableData();
    }
  }, []);

  useEffect(() => {
    if (tableData?.length > 0) {
      setShowError(false);
    } else if (tableData?.length === 0 && networkError) {
      setShowError(true);
    }
  }, [tableData, networkError]);

  const getRegionsCount = () => {
    let uniqueRegions = new Set();
    for (const rowData of tableData) {
      console.log(rowData)
      const regionId = rowData.Details.regionName;
      if (uniqueRegions.has(regionId)) continue;
      else uniqueRegions.add(regionId);
    }
    return uniqueRegions.size;
  };

  const getTotalCost = () => {
    let totalCost = tableData?.reduce(
      (acc, cur) => acc + parseFloat(cur.cost),
      0
    );
    return totalCost;
  };

  const getCardsData = () => {
    const cardsData = [
      {
        title: "Total resources",
        icon: (
          <HorizontalSplitOutlinedIcon
            style={{ color: "#e6923a" }}
            fontSize="medium"
          />
        ),
        dataDivElement: (
          <>
            <p style={{ color: "#e6923a" }}>{tableData?.length}</p>
            <p>
              <strong>Total resources</strong>
            </p>
          </>
        ),
      },
      {
        title: "Total regions",
        icon: <PublicIcon style={{ color: "#e6923a" }} fontSize="medium" />,
        dataDivElement: (
          <>
            <p style={{ color: "#e6923a" }}>{getRegionsCount()}</p>
            <p>
              {" "}
              <strong>Total regions</strong>
            </p>
          </>
        ),
      },
      {
        title: "Total cost",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            sx={{ color: "#e6923a" }}
            fontSize="medium"
          />
        ),
        dataDivElement: (
          <>
            <Tooltip title={currency + getTotalCost()?.toFixed(2)}>
              <p style={{ color: "#e6923a" }}>
                {currency + formatNumberToK(getTotalCost())}
              </p>
            </Tooltip>
            <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <strong>Total cost </strong>
              <Tooltip
                title={`The services running phase or active hours are from ${
                  month[currentMonth]
                } 1st to ${month[currentMonth]} ${getCurrentDate(
                  currentDate
                )}.`}
              >
                <InfoOutlined color="warning" fontSize="small" />
              </Tooltip>
            </p>
          </>
        ),
      },
    ];

    return cardsData;
  };

  const getTagData = () => {
    const tagsData = [
      {
        dataDivElement: (
          <>
            <Typography
              align="center"
              style={{ color: "#e6923a", fontWeight: "bold" }}
              variant="h5"
            >
              ${costWithTags}
            </Typography>
            <Typography sx={{ mt: "10px" }} align="center" variant="subtitle2">
              <strong>
                Tagged <br></br> Cost($)
              </strong>
            </Typography>
          </>
        ),
      },
      {
        dataDivElement: (
          <>
            <Typography
              align="center"
              style={{ color: "#e6923a", fontWeight: "bold" }}
              variant="h5"
            >
              ${costWithoutTags}
            </Typography>
            <Typography sx={{ mt: "10px" }} align="center" variant="subtitle2">
              <strong>Untagged Cost($)</strong>
            </Typography>
          </>
        ),
      },
    ];

    return tagsData;
  };

  return (
    <div className="page-wrapper">
      <NavigationTab activeTab={tabTypes.INVENTORY} updateLogin={updateLogin} />
      <div className="inventory-wrapper">
        <ZoomModal
          open={open}
          setOpen={setOpen}
          data={modalData}
          graphNo={graphNo}
        />
        <div className="inventory-main-container">
          <div className="content-wrapper">
            <div
              style={{
                display: "flex",
                width: "100%",
                marginTop: "80px",
                marginBottom: "40px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div className="tag-cards-container">
                  {getTagData()?.map((card) => (
                    <div key={card.title} className="tag-card">
                      {loading || networkError ? (
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {loading && <RotateRight className="loading" />}
                          {networkError && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
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
                          <div className="card-data-div">
                            {card.dataDivElement}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="slick-container">
                  <InventoryCards
                    loading={loading}
                    error={networkError}
                    cards={getCardsData()}
                  />
                </div>
              </div>
              <div style={{ flex: 2, position: "relative" }}>
                {!loading && !networkError && (
                  <IconButton
                    onClick={() => {
                      setGraphNo(3);
                      setModalData(tableData);
                      setOpen(true);
                    }}
                    sx={{ position: "absolute", right: 0, top: 0 }}
                  >
                    <ZoomOutMap sx={{ height: 15 }} />
                  </IconButton>
                )}
                <InventoryTab
                  loading={loading}
                  error={networkError}
                  data={tableData}
                />
              </div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div
                style={{
                  width: viewMore !== null ? "78%" : "100%",
                  borderRadius: "16px",
                  boxShadow: "0px 4px 16px 4px rgba(0, 0, 0, 0.10)",
                }}
              >
                {!loading && (
                  <div className="data-grid-header">
                    <div style={{ display: "flex" }}>
                      <FilterButton
                        setShowFilterBtn={setShowFilterBtn}
                        setFilt={setFilt}
                        sort={sort}
                        setSort={setSort}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        filterNo={filterNo}
                        setFilterNo={setFilterNo}
                      />
                      {sort?.length !== 0 && (
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
                              setSort([]);
                            }}
                          >
                            {sort[0].field + " " + sort[0].sort}
                            <HighlightOffIcon
                              sx={{
                                ml: "4px",
                                height: "16px",
                                color: "#000000",
                              }}
                            />
                          </Button>
                        </Tooltip>
                      )}
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
                    <div style={{ display: "flex" }}>
                      <ServiceFilter
                        setShowFilterBtn={setShowFilterBtn}
                        setFilt={setFilt}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        filterNo={filterNo}
                        setFilterNo={setFilterNo}
                      />
                      {false && (
                        <RangeFilter
                          setShowFilterBtn={setShowFilterBtn}
                          setFilt={setFilt}
                        />
                      )}
                    </div>

                    {false && (
                      <div className="nav-items-dropdown">
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                          <InputLabel id="demo-select-small-label">
                            Inventory Type
                          </InputLabel>
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={activeInventoryTab}
                            label="Inventory Type"
                            onChange={handleChange}
                          >
                            <MenuItem value={inventoryTypes.S3}>S3</MenuItem>
                            <MenuItem value={inventoryTypes.LB}>
                              Load Balancer
                            </MenuItem>
                            <MenuItem value={inventoryTypes.EC2}>EC2</MenuItem>
                            <Tooltip title="Upcoming feature">
                              <span>
                                <MenuItem disabled value={inventoryTypes.RDS}>
                                  RDS
                                </MenuItem>
                              </span>
                            </Tooltip>
                          </Select>
                        </FormControl>
                      </div>
                    )}
                    {false && <div>Download CSV</div>}
                  </div>
                )}

                <div className="table-container">
                  {showError ? (
                    <div className="center-content">
                      {" "}
                      {/* Wrap both logo and Typography */}
                      <div className="logo-div">
                        <img
                          src={errorTable}
                          alt="cw-logo"
                          className="logo-img"
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
                  ) : (
                    <InventoryTable
                      filt={filt}
                      data={tableData}
                      skeleton={skeleton}
                      sort={sort}
                      setViewMore={setViewMore}
                    />
                  )}
                </div>
              </div>
              {viewMore !== null && (
                <div
                  style={{
                    marginLeft: 10,
                    minWidth: "22%",
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
                      {viewMore.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                      <strong>Service: </strong>
                      {viewMore.service}
                    </Typography>
                    {viewMore?.tags?.length !== 0 ? (
                      <>
                        <Typography sx={{ fontWeight: "bolder", marginTop: 2 }}>
                          Tags
                        </Typography>
                        {viewMore.tags?.map((item) => (
                          <div
                            style={{
                              display: "flex",
                              marginTop: 4,
                              flexWrap: "wrap",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: 14, fontWeight: "bolder" }}
                            >
                              {item.Key}:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 14,
                                marginLeft: 0.5,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.Value}
                            </Typography>
                          </div>
                        ))}
                      </>
                    ) : (
                      ""
                    )}

                    {Object.keys(viewMore.information).map((item) =>
                      item !== "cloud_resource_link" ? (
                        <div
                          style={{
                            display: "flex",
                            marginTop: 4,
                            flexWrap: "wrap",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 14, fontWeight: "bolder" }}
                          >
                            {item}:
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 14,
                              marginLeft: 0.5,
                              wordBreak: "break-word",
                            }}
                          >
                            {viewMore.information[item]}
                          </Typography>
                        </div>
                      ) : (
                        ""
                      )
                    )}
                    <hr></hr>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {viewMore?.information?.cloud_resource_link ? (
                        <>
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            onClick={() =>
                              window.open(
                                viewMore.information?.cloud_resource_link,
                                "_blank"
                              )
                            }
                          >
                            Goto Console
                          </Button>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </Box>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
