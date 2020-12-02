import React, { useEffect, useRef, useState } from "react";
import "./HeaderM.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory, useLocation } from "react-router-dom";
import { Works } from "../Works";

export default function HeaderM(props){
    const [openMenu, setOpenMenu] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [visibility, setVisibility] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [myTimeout, setMyTimeout] = useState();

    const headerRef = useRef();

    const location = useLocation();

    const history = useHistory();

    useEffect(() => {
        const height = headerRef.current.clientHeight;
        setHeaderHeight(height);
    }, [])

    useEffect(() => {
        if(openMenu){
            clearTimeout(myTimeout);
            setFadeOut(false);
            setMyTimeout(setTimeout(() => {
                setVisibility(true);
            }, 500))
        } else{
            clearTimeout(myTimeout);
            setFadeOut(true);
            setMyTimeout(setTimeout(() => {
                setVisibility(false);
                setFadeOut(false);
            }, 100))
        }
    }, [openMenu])

    const handlePageSwitch = (destination) => {
        if(destination == location.pathname){
            setOpenMenu(false);
            props.setMenu(false);
            clearTimeout(myTimeout);
            setFadeOut(true);
            setMyTimeout(setTimeout(() => {
                setVisibility(false);
                setFadeOut(false);
            }, 100))
        } else{
            history.push(destination);
        }
    }

    return(
        <div id={props.theme == "dark" ? "mobileHeader" : "mobileHeader-light"} className={openMenu ? "expand" : ""} ref={headerRef} style={{minHeight: headerHeight}}>
            <div id="headerTop">
                <div id="mobileName" onClick={() => handlePageSwitch("/")}>
                    <h1 className="mobileH1">Tim Willaert</h1>
                    <h2 className="mobileH2">Designer x Developer</h2>
                </div>
                <div style={{fontSize: "6vw"}} onClick={() => {
                    setOpenMenu(!openMenu)
                    props.setMenu(!openMenu);
                }}>
                    {
                        openMenu ?
                        <FontAwesomeIcon icon={faTimes} id={props.theme == "dark" ? "iconDark" : "iconLight"} />
                        :
                        <FontAwesomeIcon icon={faBars} id={props.theme == "dark" ? "iconDark" : "iconLight"} />
                    }
                </div>
            </div>
            <div id={!visibility ? "menu" : "menuOpen"} className={fadeOut ? "leaveMenu" : ""}>
                <div className="mobileLink" onClick={() => handlePageSwitch("/")}>
                    <a className="mobileBtn">Home</a>
                    <img src={props.theme == "dark" ? "dist/img/arrow-right.png" : "dist/img/arrow-right-black.png"}></img>
                </div>
                <div className="mobileLink" onClick={() => handlePageSwitch("/about")}>
                    <a className="mobileBtn">About</a>
                    <img src={props.theme == "dark" ? "dist/img/arrow-right.png" : "dist/img/arrow-right-black.png"}></img>
                </div>
                <p>WORKS</p>
                {
                    Works.map((data, key) => {
                        return(
                            <div className="mobileLink" key={key} onClick={() => handlePageSwitch("/work/" + data.pathName)}>
                                <a className="mobileBtn">{data.title}</a>
                                <img src={props.theme == "dark" ? "dist/img/arrow-right.png" : "dist/img/arrow-right-black.png"}></img>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}