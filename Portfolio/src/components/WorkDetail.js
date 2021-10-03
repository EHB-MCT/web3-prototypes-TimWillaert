import React, {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  forceUpdate,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import AnimatedCursor from "react-animated-cursor";
import "./WorkDetail.css";
import { NavLink } from "react-router-dom";
import { Works } from "../Works";
import { useSpring, animated } from "react-spring";
import ImageDistort from "react-image-list-distort";
// import ProgressBar from "react-scroll-progress-bar";
import ScrollToTop from "react-scroll-up";
var parse = require("html-react-parser");

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans = (x, y) => `translate3d(${-(x / 27)}px,${-(y / 27)}px,0)`;

export default function WorkDetail() {
  const { id } = useParams();
  const [work, setWork] = useState({});
  const [workNumber, setWorkNumber] = useState(0);

  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    let obj = Works.find((obj) => obj.pathName === id);
    setWorkNumber(Works.indexOf(obj));
    setWork(obj);
    document.title = "Tim Willaert - " + obj.title;
  }, []);

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
      id="container-detail"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <AnimatedCursor
        color="150, 150, 150"
        outerAlpha="0.2"
        outerScale="8"
        innerScale="0.4"
      />
      <div id="overlay"></div>
      <div id="fadeOut-dark" className={isLeaving ? "transition" : ""}></div>
      {/* <ProgressBar bgcolor="#7B08FF" /> */}
      <div id="content-detail">
        <ScrollToTop showUnder={250} style={{ right: "10%", bottom: "8%" }}>
          <span className="up link">Top</span>
        </ScrollToTop>
        <div id="header-detail">
          <a onClick={() => handleTransition("/work")}>Close</a>
        </div>
        <div id="main-detail">
          <div id="worklanding">
            <div id="metadata">
              <h3>{"Project 0" + (workNumber + 1)}</h3>
              <h3>{work.year}</h3>
            </div>
            {work.thumbnail != undefined && (
              <div>
                <animated.div
                  className="parent"
                  style={{ transform: props.xy.interpolate(trans) }}
                >
                  <div className="child">
                    <h1>{work.title}</h1>
                    <img src={`dist/img/${work.thumbnail}`}></img>
                  </div>
                </animated.div>
                <ImageDistort
                  styles={{ zIndex: 10 }}
                  listRoot={".parent"}
                  itemRoot={".child"}
                  options={{
                    strength: 0.2,
                    geometry: {
                      shape: "plane",
                      width: 0.8,
                      height: 0.8,
                    },
                  }}
                ></ImageDistort>
              </div>
            )}
            <div id="details">
              <p>{work.description}</p>
              {work.url !== undefined && (
                <a href={work.url} target="_blank" onClick={() => {
                  gtag('event', 'link_click', {
                    'event_category' : 'View Website: ' + work.title,
                    'event_label' : 'View Website: ' + work.title
                  });
                }}>
                  Visit Website
                </a>
              )}
              {work.url === undefined && (
                <a href={work.github} target="_blank" onClick={() => {
                  gtag('event', 'link_click', {
                    'event_category' : 'View Code: ' + work.title,
                    'event_label' : 'View Code: ' + work.title
                  });
                }}>
                  View Code
                </a>
              )}
            </div>
          </div>
          <div id="scroll-detail">
            <div>
              <p>Scroll to see more</p>
              <span className="scroll-line"></span>
            </div>
          </div>
          <div id="work-explanation">
            {work.explanation !== undefined &&
              work.explanation.map((data, key) => {
                return (
                  <div className="workExpl" key={key}>
                    <div>
                      <p>{key + 1 < 10 ? "0" + (key + 1) : key + 1}</p>
                      <p>{parse(data.text)}</p>
                    </div>
                    {data.img && <img src={`dist/img/${data.img}`}></img>}
                    {data.video && (
                      <video controls src={`dist/img/${data.video}`}></video>
                    )}
                  </div>
                );
              })}
          </div>
          <div id="end-container">
            <div id="links">
              {work.url !== undefined && (
                <a href={work.url} target="_blank" onClick={() => {
                  gtag('event', 'link_click', {
                    'event_category' : 'View Website: ' + work.title,
                    'event_label' : 'View Website: ' + work.title
                  });
                }}>
                  Visit Website
                </a>
              )}
              {work.github !== undefined && (
                <a href={work.github} target="_blank" onClick={() => {
                  gtag('event', 'link_click', {
                    'event_category' : 'View Code: ' + work.title,
                    'event_label' : 'View Code: ' + work.title
                  });
                }}>
                View Code
              </a>
              )}
            </div>
            <div id="nextProject">
              <p>Next project</p>
              {work.thumbnail !== undefined && workNumber + 2 <= Works.length && (
                <div className="link">
                  <animated.div
                    className="parent2"
                    style={{ transform: props.xy.interpolate(trans) }}
                  >
                    <a
                      onClick={() =>
                        handleTransition(
                          "/work/" + Works[workNumber + 1].pathName
                        )
                      }
                      className="child2"
                    >
                      <h5>{"0" + (workNumber + 2)}</h5>
                      <h4>{Works[workNumber + 1].title}</h4>
                      <img
                        src={`dist/img/${Works[workNumber + 1].thumbnail}`}
                      ></img>
                    </a>
                  </animated.div>
                  <ImageDistort
                    styles={{ zIndex: 10 }}
                    listRoot={".parent2"}
                    itemRoot={".child2"}
                    options={{
                      strength: 0.2,
                      geometry: {
                        shape: "plane",
                        width: 0.8,
                        height: 0.8,
                      },
                    }}
                  ></ImageDistort>
                </div>
              )}
              {workNumber + 2 > Works.length && (
                <div className="link">
                  <animated.div
                    className="parent2"
                    style={{ transform: props.xy.interpolate(trans) }}
                  >
                    <a
                      onClick={() =>
                        handleTransition("/work/" + Works[0].pathName)
                      }
                      className="child2"
                    >
                      <h5>01</h5>
                      <h4>{Works[0].title}</h4>
                      <img src={`dist/img/${Works[0].thumbnail}`}></img>
                    </a>
                  </animated.div>
                  <ImageDistort
                    styles={{ zIndex: 10 }}
                    listRoot={".parent2"}
                    itemRoot={".child2"}
                    options={{
                      strength: 0.2,
                      geometry: {
                        shape: "plane",
                        width: 0.8,
                        height: 0.8,
                      },
                    }}
                  ></ImageDistort>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
