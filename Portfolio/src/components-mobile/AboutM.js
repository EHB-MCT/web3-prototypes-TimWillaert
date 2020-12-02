import React, { useEffect, useState } from "react";
import "./AboutM.css";
import HeaderM from "./HeaderM";

export default function AboutM(){
    document.title = "Tim Willaert - About";

    const [menu, setMenu] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div id="mobileContainer">
            <div id="overlay"></div>
            <HeaderM theme="dark" setMenu={setMenu}/>
            <div id="mobileAbout">
                <img src="dist/img/about/tim_colored.png"></img>
                <p>
                    Hello! I am a multimedia application designer and full-stack
                    developer. Some of the technologies I use are..
                </p>
                <div className="skills">
                    <img src="dist/img/about/react.png"></img>
                    <img src="dist/img/about/angular.png"></img>
                    <img src="dist/img/about/vue.png"></img>
                    <img src="dist/img/about/js.png"></img>
                    <img src="dist/img/about/ts.png"></img>
                    <img src="dist/img/about/node.png"></img>
                    <img src="dist/img/about/npm.png"></img>
                    <img src="dist/img/about/mongo.png"></img>
                    <img src="dist/img/about/firebase.png"></img>
                    <img src="dist/img/about/php.png"></img>
                    <img src="dist/img/about/laravel.png"></img>
                    <img src="dist/img/about/mysql.png"></img>
                    <img src="dist/img/about/java.png"></img>
                    <img src="dist/img/about/swift.png"></img>
                    <img src="dist/img/about/python.png"></img>
                </div>
                <p>Contact: tim.willaert@outlook.com</p>
                <div className="mobileLink2" onClick={() => window.open('https://www.linkedin.com/in/timwillaert/', '_blank')}>
                    <a className="mobileBtn">
                        LinkedIn
                    </a>
                    <img src={`dist/img/arrow-right.png`}></img>
                </div>
                <div className="mobileLink2" onClick={() => window.open('https://github.com/TimWillaert', '_blank')}>
                    <a className="mobileBtn">
                        GitHub
                    </a>
                    <img src={`dist/img/arrow-right.png`}></img>
                </div>
            </div>
        </div>
    )
}