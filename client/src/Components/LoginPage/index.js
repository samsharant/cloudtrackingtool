import { connect } from "react-redux";

import { login } from "../../redux/_actions/authActions";
import {Login} from "./Login";

const mapStateToProps = ({ auth }) => {
  return {
    loggedIn: auth.loggedIn,
    isLoginPending: auth.isLoginPending,
    isLoginFailed: auth.isLoginFailed,

  };
};

export default connect(mapStateToProps, {
  login,
})(Login);
