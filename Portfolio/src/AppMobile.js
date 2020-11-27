import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components-mobile/Home";

export default function AppMobile() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}
