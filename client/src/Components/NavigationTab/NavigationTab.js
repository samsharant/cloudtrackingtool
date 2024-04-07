import React, { useState } from "react";
import { Link } from "react-router-dom";
import vbLogo from "../../Assets/vb_logo.svg";
import { tabTypes } from "../../constants";
import "./NavigationTab.css";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Material-UI icon
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // Material-UI icon
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableChartIcon from "@mui/icons-material/TableChart";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { logout as logoutAction } from "../../redux/_actions/logoutAction";
import { useActions } from "../../Utils";

function NavigationTab({ activeTab, updateLogin }) {
  const [logout] = useActions([logoutAction]);
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const logoutUser = () => {
    updateLogin(false);
    logout();

    // window.location.reload(false);
    // handle dispatch
    // dispatch(isloggedin(false));
    // dispatch(setAuthToken(false));
  };

  return (
    <div className={`tabs-container ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-placeholder">
        <Link to="/">
          <img className="vb-logo" src={vbLogo} alt="Valuebound Logo" />
        </Link>
      </div>
      <Link to="/dashboard">
        <div
          className={activeTab === tabTypes.DASHBOARD ? "active-tab" : "tab"}
          style={{ fontSize: "14px" }}
        >
          {collapsed ? (
            <Tooltip title="Dashboard">
              {" "}
              <DashboardIcon />{" "}
            </Tooltip>
          ) : (
            "DASHBOARD"
          )}
        </div>
      </Link>
      <Link to="/inventory">
        <div
          className={activeTab === tabTypes.INVENTORY ? "active-tab" : "tab"}
          style={{ fontSize: "14px" }}
        >
          {collapsed ? (
            <Tooltip title="Inventory">
              <TableChartIcon />{" "}
            </Tooltip>
          ) : (
            "INVENTORY"
          )}
        </div>
      </Link>
      <Link>
        <Tooltip title="Add Members coming soon">
          <div
            className={"disabled-tab"}
            style={{
              display: "flex",
              fontSize: "14px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {collapsed ? (
              <GroupAddIcon />
            ) : (
              <>
                ADD MEMBERS
                <StarRateIcon color="warning" fontSize="small" />
              </>
            )}
          </div>
        </Tooltip>
      </Link>
      <div className="collapse-button" onClick={toggleCollapse}>
        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </div>
      <div className="logout-button">
        <Link to="/">
          <div onClick={logoutUser} className="logout-icon-container">
            <PowerSettingsNewOutlinedIcon className="logout-icon" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NavigationTab;
