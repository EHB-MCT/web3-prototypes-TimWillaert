import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";

export default function Header(props) {
  return (
    <div id={props.color === "dark" ? "header-dark" : "header"}>
      {props.activeRoute == "work" && (
        <a onClick={() => window.location.reload()} className="active">
          Work
        </a>
      )}
      {props.activeRoute !== "work" && (
        <a onClick={() => props.leaveFunction("/work")}>Work</a>
      )}
      {props.color !== "dark" && (
        <div>
          <p>
            designer<br></br>
            <span className="smaller">x</span>
            <br></br>developer
          </p>
        </div>
      )}
      {props.activeRoute == "about" && (
        <a onClick={() => window.location.reload()} className="active">
          About
        </a>
      )}
      {props.activeRoute !== "about" && (
        <a onClick={() => props.leaveFunction("/about")}>About</a>
      )}
    </div>
  );
}
