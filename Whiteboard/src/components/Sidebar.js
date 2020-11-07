import React from 'react';
import { useEffect, useRef, useState } from 'react';
import './Sidebar.css'
import PanToolIcon from '@material-ui/icons/PanTool';
import CreateIcon from '@material-ui/icons/Create';

function Sidebar(props){

    return(
        <div id="sidebar">
            <PanToolIcon onClick={() => props.setSelectedTool('pan')} className={props.selectedTool == 'pan' ? "active" : ""}/>
            <CreateIcon onClick={() => props.setSelectedTool('pen')} className={props.selectedTool == 'pen' ? "active" : ""}/>
        </div>
    );

}

export default Sidebar