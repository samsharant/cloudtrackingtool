import React from "react";
import Lottie from "lottie-react";
import "./ErrorPageStyles.css";
import errorPageAnimation from "../../Assets/errorPageAnimation.json";

function ErrorPage(props) {
  return (
    <div className="error-page-animation-wrapper">
      <div className="error-page-animation-container">
        <Lottie loop animationData={errorPageAnimation} />
        <div className="error-message">{props.errorMessage}</div>
      </div>
    </div>
  );
}

export default ErrorPage;
