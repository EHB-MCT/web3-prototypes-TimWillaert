import React, { useEffect, useLayoutEffect, useState } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Work from "./components/Work";
import WorkDetail from "./components/WorkDetail";
import About from "./components/About";

import HomeM from "./components-mobile/HomeM";
import DetailM from "./components-mobile/DetailM";
import AboutM from "./components-mobile/AboutM";

export default function App() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if(window.innerWidth <= 768){
      setIsMobile(true);
    } else{
      setIsMobile(false);
    }

    function resize(){
      if(window.innerWidth <= 768){
        setIsMobile(true);
      } else{
        setIsMobile(false);
      }
    }

    window.addEventListener('resize', resize);
  }, []);

  return (
    <Router>
      {
        !isMobile ?
        <Switch>
          <Route
            path="/work/:id"
            render={(props) => (
              <WorkDetail key={props.match.params.id} {...props} />
            )}
          />
          <Route path="/work" component={Work} />
          <Route path="/about" component={About} />
          <Route exact path="/" component={Home} />
        </Switch>
        :
        <Switch>
          <Route
            path="/work/:id"
            render={(props) => (
              <DetailM key={props.match.params.id} {...props} />
            )}
          />
          <Route path="/about" component={AboutM} />
          <Route path="/work" component={HomeM} />
          <Route exact path="/" component={HomeM}/>
        </Switch>
      }
    </Router>
  );
}
