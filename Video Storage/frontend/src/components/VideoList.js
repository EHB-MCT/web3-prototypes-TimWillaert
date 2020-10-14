import React from 'react';
import Video from './Video';

function VideoList(props){
    const list = props.list.map((item, index) => <Video key={index} index={index} item={item} updateFunction={props.updateFunction}/>)
    return(<ul>{list}</ul>)
}

export default VideoList;