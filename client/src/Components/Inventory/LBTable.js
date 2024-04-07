import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { renderTableSkeleton } from "./tableSkeleton";
import { toast } from "react-toastify";
import { baseUrl, inventoryTypes } from "../../constants";

function LBTable() {
  const [data, setData] = useState([]);

  function updateGridData() {
    axios
      .get(`${baseUrl}/lb/all`)
      .then((response) => {
        const stringifiedData = JSON.stringify(response.data.data);
        localStorage.setItem(inventoryTypes.LB, stringifiedData);
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
    const existingData = localStorage.getItem(inventoryTypes.LB);
    if (existingData) setData(JSON.parse(existingData));
    else updateGridData();
  }, []);

  function getColumns() {
    return [
      { field: "id", headerName: "ID", width: 70, disableColumnMenu: true },
      {
        field: "name",
        headerName: "Name",
        width: 250,
        disableColumnMenu: true,
      },
      {
        field: "type",
        headerName: "Type",
        width: 180,
        disableColumnMenu: true,
      },
      {
        field: "scheme",
        headerName: "Scheme",
        width: 180,
        disableColumnMenu: true,
      },
      {
        field: "region",
        headerName: "Region",
        width: 350,
        disableColumnMenu: true,
      },
      {
        field: "state",
        headerName: "State",
        width: 120,
        disableColumnMenu: true,
      },
      {
        field: "dnsName",
        headerName: "DNS Name",
        width: 180,
        disableColumnMenu: true,
      },
    ];
  }

  function getRows() {
    const rows = [];
    data.forEach((rowData, idx) => {
      const updatedRowData = {};
      const regions = [
        rowData.AvailabilityZones.map((region) => region.ZoneName),
      ];
      updatedRowData.id = idx + 1;
      updatedRowData.name = rowData.LoadBalancerName;
      updatedRowData.type = rowData.Type;
      updatedRowData.scheme = rowData.Scheme;
      updatedRowData.region = regions.toString();
      updatedRowData.state = rowData.State.Code;
      updatedRowData.dnsName = rowData.DNSName;
      rows.push(updatedRowData);
    });
    return rows;
  }

  function renderInventoryData() {
    return data.length ? (
      <DataGrid
        rows={getRows()}
        columns={getColumns()}
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

export default LBTable;
