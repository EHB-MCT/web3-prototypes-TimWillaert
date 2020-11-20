import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";

export default function Header(props) {
  return (
    <div id={props.color === "dark" ? "header-dark" : "header"}>
      <NavLink to="/work" activeClassName="active">
        Work
      </NavLink>
      {props.color !== "dark" && (
        <div>
          <p>
            designer<br></br>
            <span className="smaller">x</span>
            <br></br>developer
          </p>
        </div>
      )}
      <NavLink to="/about" activeClassName="active">
        About
      </NavLink>
    </div>
  );
}
