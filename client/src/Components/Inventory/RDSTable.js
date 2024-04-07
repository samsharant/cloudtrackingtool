import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function RDSTable() {
  const [data] = useState([]);

  function getColumns() {
    return [{ field: "id", headerName: "ID", width: 70 }];
  }

  function getRows() {
    //dynamically generate row data usign columns array
    const rows = [];
    return rows;
  }

  function renderInventoryData() {
    return data.length ? (
      <DataGrid rows={getRows()} columns={getColumns()} />
    ) : (
      <>No Data to display (RDS)</>
    );
  }

  return renderInventoryData();
}

export default RDSTable;
