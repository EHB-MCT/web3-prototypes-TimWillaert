import React from "react";
import AnimatedCursor from "react-animated-cursor";
import ImageDistort from "react-image-list-distort";
import ParallaxMousemove from "react-parallax-mousemove";
import GlitchClip from "react-glitch-effect/core/Clip";
import FadeIn from "react-fade-in";
import "./Home.css";
import image from "../img/construction.jpg";

export default function Home() {
  return (
    <div className="container">
      <AnimatedCursor color="255, 255, 255" />
      <div className="overlay"></div>
      <div className="content">
        <ul className="myListRoot">
          <li className="myListItem">
            <FadeIn transitionDuration="1000" delay="300">
              <GlitchClip>
                <p className="link">under construction</p>
              </GlitchClip>
            </FadeIn>
            <img src={image} />
          </li>
        </ul>
      </div>
      <ImageDistort
        styles={{ zIndex: 10 }}
        listRoot={".myListRoot"}
        itemRoot={".myListItem"}
        options={{
          strength: 0.2,
          effect: "stretch",
          geometry: {
            shape: "plane",
            radius: 0.5,
            segments: 128,
          },
        }}
      ></ImageDistort>
    </div>
  );
}
