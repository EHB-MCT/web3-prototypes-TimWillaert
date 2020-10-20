import React from 'react';
import File from './File';

function FileList(props){
    const list = props.list.map((item, index) => <File key={index} index={index} item={item} cancelFileFunction={props.cancelFileFunction}/>)
    return(<ul>{list}</ul>)
}

export default FileList;