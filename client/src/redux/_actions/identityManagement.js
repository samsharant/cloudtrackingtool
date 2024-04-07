
import {
    IDENTITYMANAGEMENT_SUCCESS,
    IDENTITYMANAGEMENT_FAIL,
    IDENTITYMANAGEMENT,
  } from "../_types";
  
  export const identityManagement = payload => {
    return {
      type: IDENTITYMANAGEMENT,
      payload,
    };
  };
  export const identityManagementSuccess = payload => {
    localStorage.setItem("authToken", payload.data.sessionToken);
    console.log("triggered")
    var value = {
      nextPage: payload.data.nextPage,
      Login: !payload.data.logout
    };
    localStorage.setItem("page", JSON.stringify(value));
    localStorage.setItem("username", JSON.stringify(payload.data.userName));
    localStorage.setItem("accountId", JSON.stringify(payload.data.accountId));    return {
      type: IDENTITYMANAGEMENT_SUCCESS,
      payload: {
        ...payload,
      },
    };
  };
  
  export const identityManagementFail = error => {
    localStorage.setItem("authToken",error?.response?.data?.data.sessionToken);

    var value = {
      nextPage: error?.response?.data?.data?.nextPage,
      Login: !error?.response?.data?.data?.logout
    };
    localStorage.setItem("page", JSON.stringify(value));
    return {
      type: IDENTITYMANAGEMENT_FAIL,
      error,
    };
  };
  
