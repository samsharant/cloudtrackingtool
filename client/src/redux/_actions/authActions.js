
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGIN,
} from "../_types";
import { toast } from "react-toastify";

export const login = payload => {
  return {
    type: LOGIN,
    payload,
  };
};

export const loginSuccess = payload => {
  localStorage.setItem("authToken", payload.data.sessionToken);
  var value = {
    nextPage: payload.data.nextPage,
    Login: !payload.data.logout
  };
  localStorage.setItem("page", JSON.stringify(value));
  localStorage.setItem("username", JSON.stringify(payload.data.userName));
  localStorage.setItem("accountId", JSON.stringify(payload.data.accountId));

  return {
    type: LOGIN_SUCCESS,
    payload: {
      ...payload,
    },
  };
};

export const loginFail = error => {
  if(error?.response?.data)
  toast.error(error.response.data.message)
  else
  toast.error(error.message)
  return {
    type: LOGIN_FAIL,
    error,
  };
};

export const isLoggedIn = () => {

  // const token = localStorage.getItem("token");
  // const group = localStorage.getItem("group");
console.log("logged in")
  // if (token) {

  //   return {
  //     type: LOGIN_SUCCESS,
  //     payload: { token,group},
  //   };
  // }

  // return {
  //   type: ANONEMOUS,
  // };
};

export const logout = () => {
  // localStorage.removeItem("token");
  // localStorage.removeItem("username");
  // localStorage.removeItem("group");
  // localStorage.removeItem("id");

  return {
    type: LOGOUT_SUCCESS,
  };
};

