
import {
    SESSIONMANAGEMENT_SUCCESS,
    SESSIONMANAGEMENT_FAIL,
    SESSIONMANAGEMENT,
  } from "../_types";
  
  export const sessionManagement = payload => {
    return {
      type: SESSIONMANAGEMENT,
      payload,
    };
  };
  
  export const sessionManagementSuccess = payload => {
    localStorage.setItem("authToken", payload.data.sessionToken);
    var value = {
      nextPage: payload.data.nextPage,
      Login: !payload.data.logout
    };
    localStorage.setItem("page", JSON.stringify(value));
    return {
      type: SESSIONMANAGEMENT_SUCCESS,
      payload: {
        ...payload,
      },
    };
  };
  
  export const sessionManagementFail = error => {
    localStorage.setItem("authToken",error?.response?.data?.data.sessionToken);

    var value = {
      nextPage: error?.response?.data?.data?.nextPage,
      Login: !error?.response?.data?.data?.logout
    };
    localStorage.setItem("page", JSON.stringify(value));
    return {
      type: SESSIONMANAGEMENT_FAIL,
      error,
    };
  };
  
