import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AppMobile from "./AppMobile";

const isMobile = window.innerWidth <= 1100;

ReactDOM.render(
  <React.StrictMode>{isMobile ? <AppMobile /> : <App />}</React.StrictMode>,
  document.getElementById("root")
);
