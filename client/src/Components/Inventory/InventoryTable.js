import React, { useState, useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { renderTableSkeleton } from "./tableSkeleton";
import { Button } from "@mui/material";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

function InventoryTable(props) {
  const { data } = props;
  const { filt } = props;
  const { skeleton } = props;
  const { setViewMore } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const popperRef = useRef(null);
  // const [rowID, setrowID] = useState(null);
  const [tags, setTags] = useState(null);
  const handleClickOutside = (event) => {
    if (popperRef.current && !popperRef.current.contains(event.target)) {
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const MatEdit = ({ index, cost }) => {
    const amount = formatNumberToK(cost);
    return (
      <Button
        size="small"
        color="warning"
        variant="text"
        startIcon={<AttachMoneyOutlinedIcon />}
        disableTouchRipple
        sx={{
          marginLeft: "-10px",
          "&:hover": {
            backgroundColor: "transparent", // to remove hover effect
          },
          "&:disabled": {
            color: "rgb(239,124,29)",
            pointerEvents: "none", // to disabel  click events
          },
        }}
        disabled
      >
        {amount}
      </Button>
    );
  };
  function formatNumberToK(amount) {
    if (!amount) return (0).toFixed(2);

    if (amount >= 1000) {
      return (amount / 1000).toFixed(2) + "k";
    } else {
      return amount.toFixed(2);
    }
  }
  // const OpenPopper = ({ anchorEl, popperRef, rowID }) => {
  //   return (
  //     tags && (
  //       <Popper
  //         open={Boolean(anchorEl)}
  //         anchorEl={anchorEl}
  //         placement="top-start"
  //         ref={popperRef}
  //       >
  //         <Paper>
  //           <div style={{ padding: "8px" }}>
  //             <Typography
  //               variant="subtitle1"
  //               style={{ fontWeight: "bold", marginBottom: "8px" }}
  //             >
  //               Tags
  //             </Typography>
  //             <ul style={{ listStyle: "none", padding: 0 }}>
  //               {tags.map((item, index) => (
  //                 <li key={index}>
  //                   <Typography variant="body2" style={{ margin: "4px 0" }}>
  //                     <span style={{ fontWeight: "bold" }}>{item.Key}:</span>
  //                     {item.Value}
  //                   </Typography>
  //                 </li>
  //               ))}
  //             </ul>
  //           </div>
  //         </Paper>
  //       </Popper>
  //     )
  //   );
  // };

  function getColumns() {
    return [
      {
        field: "Name",
        headerName: "Name",
        flex: 2,
        disableColumnMenu: true,
        //             renderCell: (params) => {
        //                 return (
        //                     <div
        //                         className="d-flex justify-content-between align-items-center"
        //                         style={{ cursor: "pointer" }}
        //                     >
        //                         <div>
        //                           {/* {params.row.name} */}
        //                           {String(
        //     params.row.tags && params.row.tags.user_name
        //         ? params.row.tags.user_name.toString().toLowerCase()
        //         : params.row.ARN.toString().toLowerCase()
        // )}
        //                         </div>
        //                     </div>
        //                 );
        //             },
      },
      {
        field: "serviceName",
        headerName: "Service",
        flex: 2,
        disableColumnMenu: true,
      },
      {
        field: "regionName",
        headerName: "Region",
        flex: 1,
        disableColumnMenu: true,
        // renderCell: (params) => {
        //     return (
        //         <div
        //             className="d-flex justify-content-between align-items-center"
        //             style={{ cursor: "pointer" }}
        //         >
        //             <div>
        //                 {params.row.regionName}
        //             </div>
        //         </div>
        //     );
        // },
      },
      {
        field: "serviceCost",
        headerName: "Cost",
        type: "number",
        width: 200,
        flex: 1,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <div style={{ cursor: "pointer" }}>
              <MatEdit
                index={params.row.name}
                cost={
                  params.row.serviceCost < 0
                    ? 0.0
                    : parseFloat(params.row.serviceCost)
                }
              />
            </div>
          );
        },
      },
      {
        field: "more",
        headerName: "",
        width: 120,
        flex: 1,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ cursor: "pointer" }}
            >
              <Button
                sx={{ fontSize: 12 }}
                color="warning"
                onClick={() => setViewMore(params.row)}
                variant="outlined"
              >
                View More
              </Button>
            </div>
          );
        },
      },
    ];
  }

  function getRows() {
    const rows = [];

    data.forEach((service) => {
      const serviceName = service.serviceName;
      const totalCost = service.total_cost;
      service.Details.forEach((regionDetail) => {
        regionDetail.regionDetails.forEach((detail, idx) => {
          const updatedRowData = {
            id: `${serviceName}_${idx + 1}`,
            serviceName: serviceName.replace("Amazon", ""),
            totalCost: totalCost,
            serviceCost: detail.service_cost.toFixed(2),
            ARN: detail.ARN,
            regionName: regionDetail.regionName,
            Name:
              detail.Tags && detail.Tags.user_name
                ? detail.Tags?.user_name?.toLowerCase()
                : detail.ARN,
            tags: detail.Tags,
          };

          rows.push(updatedRowData);
        });
      });
    });

    return rows;
  }

  function renderInventoryData() {
    return !skeleton ? (
      <div style={{ height: 405, width: "100%" }}>
        <DataGrid
          rows={getRows()}
          columns={getColumns()}
          initialState={{
            ...data.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
            sorting: { ...data.initialState?.sorting },
          }}
          disableColumnFilter // to disable filter icon
          // slots={{
          //   toolbar: CustomToolbar,
          //   noRowsOverlay: CustomNoRowsOverlay,
          // }}
          sx={{
            fontSize: "15px",
            backgroundColor: "white",
            marginTop: "20px",
            borderRadius: "0px 0px 8px 8px",
            borderWidth: "0px 1px 1px 1px",
            ".MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold !important",
              flexDirection: "row",
            },
          }}
          filterModel={filt}
        />
      </div>
    ) : (
      renderTableSkeleton()
    );
  }

  return renderInventoryData();
}

export default InventoryTable;
