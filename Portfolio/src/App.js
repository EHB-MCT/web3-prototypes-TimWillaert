import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Work from "./components/Work";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/work" component={Work} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}
