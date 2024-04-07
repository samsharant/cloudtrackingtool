import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { renderTableSkeleton } from "./tableSkeleton";
import { toast } from "react-toastify";
import { baseUrl, inventoryTypes } from "../../constants";
import { Button } from "@mui/material";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import byteSize from "byte-size";

function S3Table() {
  const [data, setData] = useState([]);
  const [filt, setFilt] = useState({
    items: [{}],
  });

  function updateGridData() {
    axios
      .get(`${baseUrl}/s3/all`)
      .then((response) => {
        const stringifiedData = JSON.stringify(response.data.data);
        localStorage.setItem(inventoryTypes.S3, stringifiedData);
        setData(response.data.data);
      })
      .catch((error) => {
        if (error.message.includes("Network Error")) {
          toast.error(`Please try again after some time`);
        } else {
          toast.error(`API Error: ${error.message}`);
        }
      });
  }

  useEffect(() => {
    const existingData = localStorage.getItem(inventoryTypes.S3);
    if (existingData) setData(JSON.parse(existingData));
    else updateGridData();
  }, []);

  const MatEdit = ({ index, cost }) => {
    return (
      <Button
        size="small"
        color="warning"
        variant="outlined"
        startIcon={<AttachMoneyOutlinedIcon />}
        disableTouchRipple
      >
        {cost}
      </Button>
    );
  };
  const GoToConsoleBtn = () => {
    return (
      <Button
        size="small"
        variant="outlined"
        >
        GO TO CONSOLE
      </Button>
    );
  };

  function getColumns() {
    return [
      { field: "id", headerName: "ID", width: 70, disableColumnMenu: true },
      {
        field: "name",
        headerName: "Name",
        width: 600,
        disableColumnMenu: true, // hide 3 dots menu icon 
      },
      {
        field: "bucketSize",
        headerName: "Bucket Size",
        width: 200,
        disableColumnMenu: true,
        renderCell: (params) => {
          const formattedValue = byteSize(params.value, { units: "metric" });
          return formattedValue.value + formattedValue.unit;
        },
      },
      {
        field: "bucketCost",
        headerName: "Bucket Cost",
        width: 200,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
            >
              <MatEdit index={params.row.id} cost={params.row.bucketCost} />
            </div>
          );
        },
      },
      { field: "link",
       headerName: "",
        width: 180,
        renderCell: (params) => {
          return (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}>
              <GoToConsoleBtn />
            </div>
          );
        },
       },
    ];
  }

  function getRows() {
    const rows = [];
    data.forEach((rowData, idx) => {
      const updatedRowData = {};
      updatedRowData.id = idx + 1;
      updatedRowData.name = rowData.name;
      updatedRowData.bucketSize = rowData.bucketSize;
      updatedRowData.bucketCost = rowData.bucketCost;
      updatedRowData.bucketBtn = rowData.bucketCost;
      rows.push(updatedRowData);
    });
    return rows;
  }

  function renderInventoryData() {
    return data.length ? (
      <>
        <Button
          onClick={() =>
            setFilt({
              items: [
                {
                  field: "name",      
                  operator: "contains",  
                  value: "American"        
                }
              ],
            })
          }
        >
          Click
        </Button>
        <DataGrid
          rows={getRows()}
          columns={getColumns()}
          disableColumnFilter // to disable filter icon 
          sx={{
            height: "700px",
            backgroundColor: "white",
            marginTop: "20px",
            borderRadius: "10px",
            "& .MuiDataGrid-sortIcon": {
              display: "none", // To hide the sort arrows
            },
          }}
          filterModel={filt}
        />
      </>
    ) : (
      renderTableSkeleton()
    );
  }

  return renderInventoryData();
}

export default S3Table;
