import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Work from "./components/Work";
import WorkDetail from './components/WorkDetail';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/work/:id" render={(props) => (
          <WorkDetail key={props.match.params.id} {...props} />)
        } />
        <Route path="/work" component={Work} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}
