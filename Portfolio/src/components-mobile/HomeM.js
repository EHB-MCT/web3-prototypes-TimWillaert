import React, { useEffect, useState } from "react";
import HeaderM from "./HeaderM";
import "./HomeM.css";
import { Works } from "../Works";
import { Link } from "react-router-dom";

export default function HomeM(){
    document.title = "Tim Willaert - Designer x Developer";

    const [menu, setMenu] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return(
        <div id="mobileContainer">
            <div id="overlay"></div>
            <HeaderM theme="dark" setMenu={setMenu}/>
            <div id="mobileWorks">
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