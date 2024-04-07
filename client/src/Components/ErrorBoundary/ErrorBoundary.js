// ErrorBoundary.js
import { Component } from "react";
import ErrorPage from "./ErrorPage";

class ErrorBoundary extends Component {
  state = { hasError: "" };

  componentDidCatch(error, errorInfo) {
    console.error("Error Info:", errorInfo);
    this.setState({ hasError: error.message || "Something went wrong!" });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage errorMessage={this.state.hasError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
