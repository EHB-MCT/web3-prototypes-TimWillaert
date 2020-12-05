import React, { useEffect, useLayoutEffect, useState } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Work from "./components/Work";
import WorkDetail from "./components/WorkDetail";
import About from "./components/About";

import HomeM from "./components-mobile/HomeM";
import DetailM from "./components-mobile/DetailM";
import AboutM from "./components-mobile/AboutM";

import { createHashHistory } from "history";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

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

  const history = createHashHistory();

  useEffect(() => {
    sendPageView((history.location));
    history.listen(sendPageView);
  }, [history])

  const sendPageView = (history) => {
    window.gtag('config', 'G-114X0WE4JD', {
      page_path: history.pathname || history.location.pathname,
    });
  };

  return (
    <Router history={history}>
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
