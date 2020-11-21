import React, {useEffect} from "react";
import "./Work.css";
import AnimatedCursor from "react-animated-cursor";
import Header from "./Header";
import Footer from "./Footer";
import { useSpring, animated } from "react-spring";
import ImageDistort from "react-image-list-distort";
import { Works } from "../Works";
import { Link } from "react-router-dom";

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans = (x, y) => `translate3d(${-(x / 27)}px,${-(y / 27)}px,0)`;

export default function Work() {

  document.title = "Tim Willaert - Work"

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
            {Works.map((data, key) => {
              return(
                <Link to={"/work/"+data.pathName} className="workItem link" key={key}>
                  <div>
                    <span className="workNumber">{"0" + (key + 1)}</span>
                    <h2>{data.title}</h2>
                  </div>
                <img src={`dist/img/${data.thumbnail}`}></img>
              </Link>
              )
            })}
          </animated.div>
          <ImageDistort
            styles={{ zIndex: 10 }}
            listRoot={".workList"}
            itemRoot={".workItem"}
            options={{
              strength: 0.2,
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
