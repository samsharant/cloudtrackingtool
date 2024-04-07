
import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    SIGNUP,
  } from "../_types";
  import { toast } from "react-toastify";

  export const signup = payload => {
    return {
      type: SIGNUP,
      payload,
    };
  };
  
  export const signupSuccess = payload => {
    localStorage.setItem("authToken", payload.data.sessionToken);
    var value = {
      nextPage: payload.data.nextPage,
      Login: !payload.data.logout
    };
    localStorage.setItem("page", JSON.stringify(value));
    return {
      type: SIGNUP_SUCCESS,
      payload: {
        ...payload,
      },
    };
  };
  
  export const signupFail = error => {
    if(error?.response?.data)
    toast.error(error.response.data.message)
    else
    toast.error(error.message)
    return {
      type: SIGNUP_FAIL,
      error,
    };
  };
  
  export const isLoggedIn = () => {
  
    // const token = localStorage.getItem("token");
    // const group = localStorage.getItem("group");
  console.log("logged in")
    // if (token) {
  
    //   return {
    //     type: SIGNUP_SUCCESS,
    //     payload: { token,group},
    //   };
    // }
  
    // return {
    //   type: ANONEMOUS,
    // };
  };
