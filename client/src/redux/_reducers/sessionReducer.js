import {
    SESSIONMANAGEMENT_SUCCESS,
    SESSIONMANAGEMENT_FAIL,
    SESSIONMANAGEMENT,
    LOGOUT_SUCCESS,
  } from "../_types/index";
//   console.log(JSON.parse(localStorage.getItem("page")).Login)

  const INTIAL_STATE = {
    loggedIn: JSON.parse(localStorage.getItem("page"))?.Login||false,
    isLoginPending: false,
    isLoginFailed: false,
    authToken: localStorage.getItem("authtoken")||null,
    nextPage: JSON.parse(localStorage.getItem("page"))?.nextPage||null,

  };
  
  const sessionReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
      case SESSIONMANAGEMENT :
        return {
          ...state,
          isLoginPending: true,
        };
      case SESSIONMANAGEMENT_SUCCESS :
        console.log('updating state')
        return {
          ...state,
          loggedIn: !action.payload.data.logout,
          authToken: action.payload.data.sessionToken,
          username: action.payload.data.userName,
          nextPage: action.payload.data.nextPage,
        //   isLoginPending: false,
        //   isLoginFailed: false,
        };
  
      case SESSIONMANAGEMENT_FAIL :
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
  
  export default sessionReducer;
  