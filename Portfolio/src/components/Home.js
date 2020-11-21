import React, { useState, useRef, useEffect } from "react";
import AnimatedCursor from "react-animated-cursor";
import "./Home.css";
import { Link } from "react-router-dom";
import BIRDS from "vanta/dist/vanta.birds.min";
import * as THREE from "three";
import TextTransition, { presets } from "react-text-transition";
import { useSpring, animated } from "react-spring";
import Header from "./Header";
import { useHistory } from "react-router-dom";

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans = (x, y) => `translate3d(${-(x / 27)}px,${-(y / 27)}px,0)`;

export default function Home() {

  document.title = "Tim Willaert - Designer x Developer"

  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  const [vantaEffect, setVantaEffect] = useState(0);
  const [lineText, setLineText] = useState("Portfolio");
  const myRef = useRef(null);

  const history = useHistory();

  useEffect(() => {
    const effect = BIRDS({
      THREE,
      el: myRef.current,
      backgroundColor: 0xe8e8e8,
      color1: 0x8030dc,
      color2: 0x666666,
    });
    if (!vantaEffect) {
      setVantaEffect(effect);
      let myInterval = setInterval(() => {
        window.dispatchEvent(new Event("resize"));
      }, 1);
      setTimeout(() => {
        clearInterval(myInterval);
      }, 3000);
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleScroll = () => {
    history.push("/work");
  };

  return (
    <div
      id="container"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
      onWheel={handleScroll}
    >
      <AnimatedCursor
        color="150, 150, 150"
        outerAlpha="0.2"
        outerScale="8"
        innerScale="0.4"
      />
      <div id="overlay"></div>
      <div id="content">
        <Header />
        <div id="main">
          <div id="effect" ref={myRef}></div>
          <animated.div style={{ transform: props.xy.interpolate(trans) }}>
            <Link to="/work">
              <h1
                onMouseOver={() => setLineText("Explore")}
                onMouseLeave={() => setLineText("Portfolio")}
              >
                Tim<br></br>Willaert
              </h1>
            </Link>
          </animated.div>
          <animated.div style={{ transform: props.xy.interpolate(trans) }}>
            <div id="lineDiv">
              <span className="line"></span>
              <h2>
                <TextTransition
                  text={lineText}
                  springConfig={presets.gentle}
                  direction={lineText === "Portfolio" ? "down" : "up"}
                />
              </h2>
            </div>
          </animated.div>
        </div>
        <div id="footer">
          <div>
            <p>Scroll to discover</p>
            <span className="scroll-line"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
