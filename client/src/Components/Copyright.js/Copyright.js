import React from "react";
import { Link as RedirectTo } from "react-router-dom";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { productName } from "../../constants";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <RedirectTo to="/">
        <Link href="#">{productName}</Link>
      </RedirectTo>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Copyright;
