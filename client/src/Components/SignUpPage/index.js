import { connect } from "react-redux";

import { signup } from "../../redux/_actions/signupActions";
import {SignUpPage} from "./SignUpPage";

const mapStateToProps = ({ signup }) => {
  return {
    loggedIn: signup.loggedIn,
    isLoginPending: signup.isLoginPending,
    isLoginFailed: signup.isLoginFailed,
    // userGroup: auth.userGroup,

  };
};

export default connect(mapStateToProps, {
    signup,
})(SignUpPage);
