import React, { useState } from "react";
import "./About.css";
import AnimatedCursor from "react-animated-cursor";
import Header from "./Header";
import Footer from "./Footer";
import { useSpring, animated } from "react-spring";
import { useHistory } from "react-router-dom";

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
            <img src="dist/img/tim_colored.png"></img>
            <p>
              Hello! I am a multimedia application designer and full-stack
              developer from Belgium.
            </p>
          </animated.div>
          <div id="contact">
            <a href="https://www.linkedin.com/in/timwillaert/" target="_blank">
              LinkedIn
            </a>
            <a href="mailto:tim.willaert@outlook.com" className="selectable">
              tim.willaert@outlook.com
            </a>
            <a href="https://github.com/TimWillaert" target="_blank">
              GitHub
            </a>
          </div>
        </div>
        <Footer leaveFunction={handleTransition} />
      </div>
    </div>
  );
}
