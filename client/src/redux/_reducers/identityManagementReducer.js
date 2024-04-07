import {
    IDENTITYMANAGEMENT,
    IDENTITYMANAGEMENT_SUCCESS,
    LOGIN_SUCCESS,
    IDENTITYMANAGEMENT_FAIL,
    LOGOUT_SUCCESS,
  } from "../_types/index";
  
  const INTIAL_STATE = {
    loggedIn: JSON.parse(localStorage.getItem("page"))?.Login||false,
    isLoginPending: false,
    isLoginFailed: false,
    authToken: localStorage.getItem("authtoken")||null,
    nextPage: JSON.parse(localStorage.getItem("page"))?.nextPage||null,
    username: JSON.parse(localStorage.getItem("username"))||null,
    accountId: JSON.parse(localStorage.getItem("accountId"))||null,
  };
  
  const identityManagementReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
      case IDENTITYMANAGEMENT :
        return {
          ...state,
          isLoginPending: true,
        };
      case IDENTITYMANAGEMENT_SUCCESS || LOGIN_SUCCESS :
   
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
  
      case IDENTITYMANAGEMENT_FAIL :
        return {
          ...state,
          loggedIn: false,
          isLoginPending: false,
          isLoginFailed: true,
        };
        case LOGOUT_SUCCESS :
          return {
            ...state,
            loggedIn: false,
            authToken: null,
            nextPage: null,
          };
      default:
        return state;
    }
  };
  
  export default identityManagementReducer;
  