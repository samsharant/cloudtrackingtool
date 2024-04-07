import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./Dashboard.css";

// Columns configuration
const initialColumns = [
  {
    field: "id",
    headerName: "#",
    flex: 0.1,
    headerClassName: "bold-header bold-special",
    cellClassName: "grey-cell",
    disableColumnMenu: true,
  },
  {
    field: "service",
    headerName: "SERVICE",
    flex: 0.9,
    headerClassName: "bold-header bold-special resize-col",
    cellClassName: "grey-cell",
    disableColumnMenu: true,
  },
  {
    field: "cost",
    headerName: "COST",
    flex: 0.3,
    headerClassName: "bold-header bold-orange",
    cellClassName: "orange-cell",
    disableColumnMenu: true,
  },
];

// Function to convert data to rows compatible with DataGrid
const convertDataToRows = (data) => {
  let rows = [];
  data?.forEach((service, index) => {
    rows.push({
      id: index + 1,
      service: service.serviceName.replace("Amazon", ""),
      cost: `$${parseFloat(service.total_cost).toFixed(2)}`, // Adding $ sign before the cost value
    });
  });
  return rows;
};

export default function DashboardTable({ data }) {
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let updatedColumns = [...initialColumns];

      if (screenWidth >= 1500) {
        updatedColumns = initialColumns.map((col) =>
          col.field === "service" ? { ...col, flex: 1.5 } : col
        );
      } else if (screenWidth >= 1350) {
        updatedColumns = initialColumns.map((col) =>
          col.field === "service" ? { ...col, flex: 1.3 } : col
        );
      }

      setColumns(updatedColumns);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const rows = convertDataToRows(data);
  // console.log(data);
  return (
    <div style={{ height: 370, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        pageSize={5}
        disableSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } }
        }}
        className="dashboard-datagrid"
      />
    </div>
  );
}
