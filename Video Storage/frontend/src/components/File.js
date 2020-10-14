import React from 'react';
const filesize = window.filesize;

function File(props){
  
    var style = {
      width: props.item.progress + '%'
    }
  
    return(
      <li>
        <div className="fileName">
          {props.item.file.name}
        </div>
        <div className="fileSize">
          {filesize(props.item.file.size)}
        </div>
        <div className="fileProgress">
          <span style={style} className={props.item.progress == 100 ? 'greenFile' : ''}></span>
        </div>
      </li>
    )
}

export default File;