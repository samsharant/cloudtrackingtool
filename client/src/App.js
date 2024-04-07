import "./App.css";
import { useState, useEffect } from "react";
import Dashboard from "./Components/Dashboard/Dashboard";
import NewDashboard from "./Components/NewDashboard/NewDashboard";

import Inventory from "./Components/Inventory/Inventory";
import AddMembersPage from "./Components/AddMembersPage/AddMembersPage";
import AboutUsPage from "./Components/AboutUs/AboutUs";
//routes
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Components/LoginPage/Login";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import LandingPage2 from "./Components/LandingPage2/LandingPage2";
import SignUpPage from "./Components/SignUpPage/SignUpPage";
import ConfirmEmailPage from "./Components/VerifyUser/VerifyUser";
import NewInventory from "./Components/NewInventory/NewInventory";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import SelectStackPage from "./Components/SelectStackPage/SelectStackPage";
import ARNPage from "./Components/ARNPage/ARNPage";
import {
  isLoggedInSelector,
  nextPageSelector,
} from "./redux/_selectors/sessionSelector";
import { sessionManagement as sessionManagementAction } from "./redux/_actions/sessionAction";
import { useActions } from "./Utils";
import { logout as logoutAction } from "../src/redux/_actions/logoutAction";
import PricingPage from "./Components/PricingPage/PricingPage";
import ContactUs from "./Components/ContactUs/ContactUs";

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  console.log("logged in - ", loggedIn);

  //bypass login
  const [selected, setSelected] = useState(true);
  const [apiHit, setApiHit] = useState(false);
  const [delayError, setDelayError] = useState(false);
  const [networkInventoryError, setNetworkInventoryError] = useState(false);

  const [inventoryData, setInventoryData] = useState();
  const [sessionManagement] = useActions([sessionManagementAction]);
  const [logout] = useActions([logoutAction]);

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const user = useSelector(isLoggedInSelector);
  const nextPage = useSelector(nextPageSelector);

  // const sessionToken = useSelector((state) => state.auth.authToken);
  // const { nextPage } = sessionToken;
  const handleSubmit = async (encryptedToken) => {
    const response = await sessionManagement({ encryptedToken });
    if (response) {
      // const { nextPage } = sessionToken;
      // const { Logout } = sessionToken;
      // console.log(sessionToken.nextPage);
      // dispatch(isloggedin(!Logout));
      // setLoggedIn(!Logout);
      // navigate(nextPage);
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const encryptedToken = localStorage.getItem("authToken") || false;
      if (encryptedToken) {
        handleSubmit(encryptedToken);
      }
      console.log(user);
      if (user) {
        if (encryptedToken == "undefined") {
          setLoggedIn(false);
          logout();
        } else {
          setLoggedIn(user);
          console.log(user, "---------");
          navigate(nextPage);
        }
      } else {
        if (nextPage == "/login") {
          setLoggedIn(user);
          logout();
        }
      }
    }, 40 * 20 * 1000); // 20 minutes in milliseconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <ErrorBoundary>
      <div data-testid="app-component" className="App">
        <Routes>
          <Route
            path="/login"
            element={
              //   loggedIn ? (
              //     <Navigate to="/dashboard" />
              //   ) : (
              <Login updateLogin={setLoggedIn} />
              //   )
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                networkInventoryError={networkInventoryError}
                setNetworkInventoryError={setNetworkInventoryError}
                delayError={delayError}
                setDelayError={setDelayError}
                updateLogin={setLoggedIn}
                apiHit={apiHit}
                setApiHit={setApiHit}
                setInventoryData={setInventoryData}
                inventoryData={inventoryData}
              />
            }
          />
          <Route
            path="/inventory"
            element={
              loggedIn ? (
                <NewInventory
                  networkInventoryError={networkInventoryError}
                  setNetworkInventoryError={setNetworkInventoryError}
                  delayError={delayError}
                  setDelayError={setDelayError}
                  updateLogin={setLoggedIn}
                  apiHit={apiHit}
                  setApiHit={setApiHit}
                  setInventoryData={setInventoryData}
                  inventoryData={inventoryData}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* <Route path="/newInventory" element={<NewInventory />} /> */}

          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUsPage />} />

          <Route path="/verify-user" element={<ConfirmEmailPage />} />
          <Route
            path="/add-members"
            element={loggedIn ? <AddMembersPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={
              //   loggedIn ? (
              //     <Navigate to="/dashboard" />
              //   ) : (
              <SignUpPage updateLogin={setLoggedIn} />
              //   )
            }
          />
          <Route
            path="/identity-management"
            element={
              loggedIn ? (
                selected ? (
                  <SelectStackPage
                    setSelected={setSelected}
                    updateLogin={setLoggedIn}
                  />
                ) : (
                  <ARNPage updateLogin={setLoggedIn} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* <Route
            path="/identity-management"
            element={
              loggedIn ? (
                selected ? (
                  <SelectStackPage
                    setSelected={setSelected}
                    updateLogin={setLoggedIn}
                  />
                ) : (
                  <ARNPage updateLogin={setLoggedIn} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* <Route
            path="/identity-management"
            element={
              loggedIn ? (
                <Navigate to="/dashboard" />
              ) : "/identity-management" ? (
                <ConfirmationPage updateLogin={setLoggedIn} />
              ) : (
                <Navigate to="/login" />
              )
            }
          /> */}
          <Route path="*" element={<LandingPage2 isLoggedIn={loggedIn} />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
