import React from "react";
import "./About.css";
import AnimatedCursor from "react-animated-cursor";
import Header from "./Header";
import Footer from "./Footer";

export default function About(){

    document.title = "Tim Willaert - About"

    return(
        <div id="container-about">
            <AnimatedCursor
                color="150, 150, 150"
                outerAlpha="0.3"
                outerScale="8"
                innerScale="0.4"
            />
            <div id="overlay"></div>
            <div id="content">
                <Header color="dark" />
                <Footer />
            </div>
        </div>
    )
}