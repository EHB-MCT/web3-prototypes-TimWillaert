import React from "react";
import "./About.css";
import AnimatedCursor from "react-animated-cursor";
import Header from "./Header";
import Footer from "./Footer";
import { useSpring, animated } from "react-spring";

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans = (x, y) => `translate3d(${-(x / 27)}px,${-(y / 27)}px,0)`;

export default function About() {
  document.title = "Tim Willaert - About";

  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

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
      <p id="about">About</p>
      <div id="overlay"></div>
      <div id="content">
        <Header color="dark" />
        <div id="main">
          <animated.div style={{ transform: props.xy.interpolate(trans) }}>
            <img src="dist/img/tim.png"></img>
            <p>
              Hello! I am a designer and full-stack developer from Belgium
              specializing in creating multimedia applications and experiences.
            </p>
          </animated.div>
          <div id="contact">
            <a href="https://www.linkedin.com/in/timwillaert/" target="_blank">
              LinkedIn
            </a>
            <a HREF="mailto:tim.willaert@outlook.com">
              tim.willaert@outlook.com
            </a>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
