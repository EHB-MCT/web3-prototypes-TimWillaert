import React, { useEffect, useState } from "react";
import "./DetailM.css";
import HeaderM from "./HeaderM";
import { Works } from "../Works";
import { useParams } from "react-router-dom";
var parse = require("html-react-parser");

export default function DetailM(){
    const { id } = useParams();
    const [work, setWork] = useState({});
    const [workNumber, setWorkNumber] = useState(0);

    const [menu, setMenu] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        let obj = Works.find((obj) => obj.pathName === id);
        setWorkNumber(Works.indexOf(obj));
        setWork(obj);
        document.title = "Tim Willaert - " + obj.title;
    }, []);

    useEffect(() => {
        if(menu){
            setScrollTop(window.pageYOffset)
            setTimeout(() => {
                setVisible(false);
            }, 500)
        } else{
            setVisible(true);
            setTimeout(() => {
                window.scroll(0, scrollTop)
            }, 1)
        }
    }, [menu])

    return (
        <div id="mobileContainer-light">
            <div id="overlay"></div>
            <HeaderM theme="light" setMenu={setMenu}/>
            <div id="mobileWorkDetail" className={visible ? "showContent" : "hideContent"}>
                <div id="mobileMetadata">
                    <h3>{"Project 0" + (workNumber + 1)}</h3>
                    <h3>{work.year}</h3>
                </div>
                <h1>{work.title}</h1>
                <p>{work.description}</p>
                {
                    work.url !== undefined ?
                    <div className="mobileLink" onClick={() => {
                        gtag('event', 'link_click', {
                            'event_category' : 'View Website: ' + work.title,
                            'event_label' : 'View Website: ' + work.title
                          });
                        window.open(work.url, '_blank')
                    }}>
                        <a className="mobileBtn">
                            Visit Website
                        </a>
                        <img src={`dist/img/arrow-right-black.png`}></img>
                    </div>
                    :
                    <div className="mobileLink" onClick={() => {
                        gtag('event', 'link_click', {
                            'event_category' : 'View Code: ' + work.title,
                            'event_label' : 'View Code: ' + work.title
                          });
                        window.open(work.github, '_blank')
                    }}>
                        <a className="mobileBtn">
                            View Code
                        </a>
                        <img src={`dist/img/arrow-right-black.png`}></img>
                    </div>
                }
                {work.explanation !== undefined &&
                    work.explanation.map((data, key) => {
                        return(
                            <div className="mobileWorkExpl" key={key}>
                                <p>{parse(data.text)}</p>
                                {data.img && <img src={`dist/img/${data.img}`}></img>}
                                {data.video && (
                                    <video controls src={`dist/img/${data.video}`}></video>
                                )}
                            </div>
                        )
                    })
                }
                {work.url !== undefined && (
                    <div className="mobileLink2" onClick={() => {
                        gtag('event', 'link_click', {
                            'event_category' : 'View Website: ' + work.title,
                            'event_label' : 'View Website: ' + work.title
                          });
                        window.open(work.url, '_blank')
                    }}>
                        <a className="mobileBtn">
                            Visit Website
                        </a>
                        <img src={`dist/img/arrow-right-black.png`}></img>
                    </div>
                )}
                <div className="mobileLink2" onClick={() => {
                    gtag('event', 'link_click', {
                        'event_category' : 'View Code: ' + work.title,
                        'event_label' : 'View Code: ' + work.title
                      });
                    window.open(work.github, '_blank')
                }}>
                    <a className="mobileBtn">
                        View Code
                    </a>
                    <img src={`dist/img/arrow-right-black.png`}></img>
                </div>
            </div>
        </div>
    )
}