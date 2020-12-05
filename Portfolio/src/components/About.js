import React, { useState } from "react";
import "./About.css";
import AnimatedCursor from "react-animated-cursor";
import Header from "./Header";
import Footer from "./Footer";
import { useSpring, animated } from "react-spring";
import { useHistory } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans = (x, y) => `translate3d(${-(x / 27)}px,${-(y / 27)}px,0)`;

export default function About() {
  document.title = "Tim Willaert - About";

  const [isLeaving, setIsLeaving] = useState(false);

  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  const history = useHistory();

  const handleTransition = (dest) => {
    setIsLeaving(true);
    setTimeout(() => {
      history.push(dest);
    }, 1000);
  };

  return (
    <div
      id="container-about"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <AnimatedCursor
        color="150, 150, 150"
        outerAlpha="0.3"
        outerScale="8"
        innerScale="0.4"
      />
      <div id="about">
        <p>About</p>
      </div>
      <div id="overlay"></div>
      <div id="fadeOut-dark" className={isLeaving ? "transition" : ""}></div>
      <div id="content">
        <Header
          color="dark"
          leaveFunction={handleTransition}
          activeRoute="about"
        />
        <div id="main">
          <animated.div style={{ transform: props.xy.interpolate(trans) }}>
            <img src="dist/img/about/tim_colored.png"></img>
          </animated.div>
            <p>
              Hello! I am a multimedia application designer and full-stack
              developer. Some of the technologies I use are..
            </p>
            <div className="skills">
              <img src="dist/img/about/react.png" data-tip='React'></img>
              <img src="dist/img/about/angular.png" data-tip='Angular'></img>
              <img src="dist/img/about/vue.png" data-tip='Vue'></img>
              <img src="dist/img/about/js.png" data-tip='JavaScript'></img>
              <img src="dist/img/about/ts.png" data-tip='TypeScript'></img>
              <img src="dist/img/about/node.png" data-tip='Node.js'></img>
              <img src="dist/img/about/npm.png" data-tip='NPM'></img>
              <img src="dist/img/about/mongo.png" data-tip='MongoDB'></img>
              <img src="dist/img/about/firebase.png" data-tip='Firebase'></img>
              <img src="dist/img/about/php.png" data-tip='PHP'></img>
              <img src="dist/img/about/laravel.png" data-tip='Laravel'></img>
              <img src="dist/img/about/mysql.png" data-tip='MySQL'></img>
              <img src="dist/img/about/java.png"data-tip='Java'></img>
              <img src="dist/img/about/swift.png" data-tip='Swift'></img>
              <img src="dist/img/about/python.png" data-tip='Python'></img>
              <ReactTooltip className="tooltip" effect="solid"/>
            </div>
          <div id="contact">
            <a href="https://www.linkedin.com/in/timwillaert/" target="_blank" onClick={() => {
              gtag('event', 'link_click', {
                'event_category' : 'LinkedIn',
                'event_label' : 'LinkedIn'
              });
            }}>
              LinkedIn
            </a>
            <a href="mailto:tim.willaert@outlook.com" className="selectable">
              tim.willaert@outlook.com
            </a>
            <a href="https://github.com/TimWillaert" target="_blank" onClick={() => {
              gtag('event', 'link_click', {
                'event_category' : 'GitHub',
                'event_label' : 'GitHub'
              });
            }}>
              GitHub
            </a>
          </div>
        </div>
        <Footer leaveFunction={handleTransition} />
      </div>
    </div>
  );
}
