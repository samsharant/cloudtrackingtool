
import {
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT,
  } from "../_types";

  export const logout = payload => {
    return {
      type: LOGOUT,
      payload,
    };
  };
  
  export const logoutSuccess = payload => {
    localStorage.clear();
    return {
      type: LOGOUT_SUCCESS,
      payload: {
        ...payload,
      },
    };
  };
  
  export const logoutFail = error => {
    localStorage.clear();
    return {
      type: LOGOUT_FAIL,
      error,
    };
  };
  