import React from "react";
import "./Footer.css";
import { NavLink } from "react-router-dom";

export default function Footer(props) {
  return (
    <div id="footer-dark">
      <a onClick={() => props.leaveFunction("/")}>Home</a>
    </div>
  );
}
