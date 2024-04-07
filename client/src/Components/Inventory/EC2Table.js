import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { renderTableSkeleton } from "./tableSkeleton";
import { toast } from "react-toastify";
import { baseUrl, inventoryTypes } from "../../constants";
import { Button } from "@mui/material";
import CpuUtilizationAnimation from "../Animations/CpuUtilization";

function EC2Table() {
  const GoToConsoleBtn = () => {
    return (
      <Button size="small" variant="outlined">
        GO TO CONSOLE
      </Button>
    );
  };
  const [columns] = useState([
    { field: "id", headerName: "ID", width: 150, disableColumnMenu: true },
    { field: "name", headerName: "Name", width: 150, disableColumnMenu: true },
    { field: "type", headerName: "Type", width: 150, disableColumnMenu: true },
    {
      field: "region",
      headerName: "Region",
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: "platform",
      headerName: "Platform",
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: "cpuUtilization",
      headerName: "CPU Utilization",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
            >
              <CpuUtilizationAnimation />
            </div>
          );
        } else return params.value;
      },
    },
    {
      field: "link",
      headerName: "",
      width: 180,
      renderCell: (params) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <GoToConsoleBtn />
          </div>
        );
      },
    },
  ]);
  const [rows, setRows] = useState([]);

  function getRandomPercentage() {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    return randomNumber + "%";
  }

  async function updateGridData() {
    let gridData = [];

    const existingData = JSON.parse(localStorage.getItem(inventoryTypes.EC2));
    if (existingData) gridData = existingData;
    else {
      gridData = await axios
        .get(`${baseUrl}/ec2/all`)
        .then((response) => {
          const stringifiedData = JSON.stringify(response.data.data);
          localStorage.setItem(inventoryTypes.EC2, stringifiedData);
          return response.data.data;
        })
        .catch((error) => {
          if (error.message.includes("Network Error")) {
            toast.error(`Please try again after some time`);
          } else {
            toast.error(`API Error: ${error.message}`);
          }
        });
    }

    const newRows = [];

    gridData.forEach((rowData, idx) => {
      let name = rowData.Tags?.find((tag) => tag.Key === "Name")?.Value ?? "";
      const updatedRowData = {};
      updatedRowData.id = idx + 1;
      updatedRowData.name = name;
      updatedRowData.type = rowData.InstanceType;
      updatedRowData.region = rowData.Placement.AvailabilityZone;
      updatedRowData.state = rowData.State.Name;
      updatedRowData.platform = rowData.PlatformDetails;
      updatedRowData.cpuUtilization = "";
      newRows.push(updatedRowData);
    });
    setRows(newRows);

    setTimeout(() => {
      const updatedGridData = [...newRows];
      updatedGridData.forEach(
        (row) => (row.cpuUtilization = getRandomPercentage())
      );
      setRows(updatedGridData);
    }, 3000);

    //make a (post) api call
    //update the cpuUtilization data with the response and clear timer
    //else
  }

  useEffect(() => {
    updateGridData();
  }, []);

  function renderInventoryData() {
    return rows.length ? (
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          height: "700px",
          backgroundColor: "white",
          marginTop: "20px",
          borderRadius: "10px",
          "& .MuiDataGrid-sortIcon": {
            display: "none", // To hide the sort arrows
          },
        }}
      />
    ) : (
      renderTableSkeleton()
    );
  }

  return renderInventoryData();
}

export default EC2Table;
