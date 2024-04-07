import { connect } from "react-redux";
import { confirmationPage } from "../../redux/_actions/identityManagement";
import {ConfirmationPage} from "./ConfirmationPage";

const mapStateToProps = ({ identityManagement }) => {
  return {
    loggedIn: identityManagement.loggedIn,
    isLoginPending: identityManagement.isLoginPending,
    isLoginFailed: identityManagement.isLoginFailed,

  };
};

export default connect(mapStateToProps, {
    confirmationPage,
})(ConfirmationPage);
