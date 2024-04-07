import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'; // Import the Provider
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./redux/_reducers"
import { rootEpic } from "./redux/_epics";
import axios from "axios";
import { createEpicMiddleware } from "redux-observable";
// import store from './store/store'

const epicMiddleware = createEpicMiddleware({
  dependencies: { axios },
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(epicMiddleware));

const store = createStore(reducers, enhancer);
epicMiddleware.run(rootEpic);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
      />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

