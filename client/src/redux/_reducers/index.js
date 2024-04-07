import { combineReducers } from 'redux';

import auth from './authReducer';
import signup from './signupReducer'
import identityManagement from './identityManagementReducer';
import session from './sessionReducer'
const reducers = combineReducers({
  // root,

  auth,
  signup,
  identityManagement,
  session,

});

const reducer = (state, action) => {
  // if (action.type === LOGOUT_SUCCESS) state = undefined;
  // console.log("MAIN------------",action)
  return reducers(state, action);
};

export default reducer;
