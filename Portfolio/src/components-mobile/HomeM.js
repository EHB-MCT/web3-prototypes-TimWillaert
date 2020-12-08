import React, { useEffect, useRef, useState } from "react";
import HeaderM from "./HeaderM";
import "./HomeM.css";
import { Works } from "../Works";
import { Link } from "react-router-dom";

export default function HomeM(){
    document.title = "Tim Willaert - Designer x Developer";

    const [menu, setMenu] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
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

    return(
        <div id="mobileContainer">
            <div id="overlay"></div>
            <HeaderM theme="dark" setMenu={setMenu}/>
            <div id="mobileWorks" className={visible ? "showContent" : "hideContent"}>
                {Works.map((data, key) => {
                    return(
                    <Link to={"/work/" + data.pathName} key={key}>
                        <div className="mobileWorkItem">
                            <p className="mobileWorkNumber">{"0" + (key + 1)}</p>
                            <img src={`dist/img/${data.thumbnail}`}></img>
                            <div>
                                <h1 className="mobileH1">{data.title}</h1>
                                <img src={`dist/img/arrow-right.png`}></img>
                            </div>
                        </div>
                    </Link>
                    )
                })}
            </div>
        </div>
    )
}