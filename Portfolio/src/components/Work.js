import React from "react";
import "./Work.css";
import AnimatedCursor from "react-animated-cursor";
import Header from "./Header";
import Footer from "./Footer";
import { useSpring, animated } from "react-spring";
import ImageDistort from "react-image-list-distort";
import image from "../img/tim.png";
import image2 from "../img/grain.jpg";
import image3 from "../img/construction.jpg";

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans = (x, y) => `translate3d(${-(x / 27)}px,${-(y / 27)}px,0)`;

export default function Work() {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  return (
    <div
      id="container-dark"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <AnimatedCursor
        color="150, 150, 150"
        outerAlpha="0.3"
        outerScale="8"
        innerScale="0.4"
      />
      <div id="overlay"></div>
      <div id="content">
        <Header color="dark" />
        <div id="main-work">
          <animated.div
            className="workList"
            style={{ transform: props.xy.interpolate(trans) }}
          >
            <li className="workItem link">
              <div>
                <span className="workNumber">01</span>
                <h2>Dots&Pix</h2>
              </div>
              <img src={image}></img>
            </li>
            <li className="workItem link">
              <div>
                <span className="workNumber">02</span>
                <h2>Synth Rider</h2>
              </div>
              <img src={image2}></img>
            </li>
            <li className="workItem link">
              <div>
                <span className="workNumber">03</span>
                <h2>Proximity</h2>
              </div>
              <img src={image3}></img>
            </li>
          </animated.div>
          <ImageDistort
            styles={{ zIndex: 10 }}
            listRoot={".workList"}
            itemRoot={".workItem"}
            options={{
              strength: 0.3,
              geometry: {
                shape: "plane",
                width: 0.7,
                height: 0.7,
              },
            }}
          ></ImageDistort>
        </div>
        <Footer />
      </div>
    </div>
  );
}
