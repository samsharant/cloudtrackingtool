import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  IDENTITYMANAGEMENT_SUCCESS,
  LOGOUT,
  LOGOUT_FAIL,
} from "../_types/index";
//   console.log(JSON.parse(localStorage.getItem("page")).Login)

const INTIAL_STATE = {
  loggedIn: JSON.parse(localStorage.getItem("page"))?.Login || false,
  isLoginPending: false,
  isLoginFailed: false,
  authToken: localStorage.getItem("authtoken") || null,
  nextPage: JSON.parse(localStorage.getItem("page"))?.nextPage || null,
  username: JSON.parse(localStorage.getItem("username")) || null,
  accountId: JSON.parse(localStorage.getItem("accountId")) || null,
};

const authReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoginPending: true,
      };
    case LOGIN_SUCCESS || IDENTITYMANAGEMENT_SUCCESS:
      return {
        ...state,
        loggedIn: !action.payload.data.logout,
        authToken: action.payload.data.sessionToken,
        username: action.payload.data.userName,
        nextPage: action.payload.data.nextPage,
        accountId: action.payload.data.accountId,
        isLoginPending: false,
        isLoginFailed: false,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        loggedIn: false,
        isLoginPending: false,
        isLoginFailed: true,
      };

    case LOGOUT:
      return {
        ...state,
        isLoginPending: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false,
        authToken: null,
        username: "",
        nextPage: "/Login",
        isLoginPending: false,
        isLoginFailed: false,
      };

    case LOGOUT_FAIL:
      return {
        ...state,
        loggedIn: false,
        isLoginPending: false,
        isLoginFailed: true,
      };

    default:
      return state;
  }
};

export default authReducer;
