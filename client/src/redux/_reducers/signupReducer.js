import {
    SIGNUP,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGOUT_SUCCESS
  } from "../_types/index";
  const INTIAL_STATE = {
    loggedIn: JSON.parse(localStorage.getItem("page"))?.Login||false,
    isLoginPending: false,
    isLoginFailed: false,
    authToken: localStorage.getItem("authtoken")||null,
    nextPage: JSON.parse(localStorage.getItem("page"))?.nextPage||null,

  };
  
  const signupReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
      case SIGNUP :
        return {
          ...state,
          isLoginPending: true,
        };
      case SIGNUP_SUCCESS :
        console.log('updating SIGNUP_SUCCESS state')
        return {
          ...state,
          loggedIn: !action.payload.data.logout,
          authToken: action.payload.data.sessionToken,
          nextPage: action.payload.data.nextPage,
          isLoginPending: false,
          isLoginFailed: false,
        };
  
      case SIGNUP_FAIL :
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
  
  export default signupReducer;
  