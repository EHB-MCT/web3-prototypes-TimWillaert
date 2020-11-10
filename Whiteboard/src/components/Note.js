import React from "react";
import "./Note.css";
import Draggable from "react-draggable";

function Note(props) {
  return (
    <div onClick={() => props.setSelectedTool(null)}>
      <Draggable
        disabled={props.selectedTool === "pan"}
        bounds={{
          top: -((window.innerHeight * 4) / 4) - 11,
          left: -((window.innerWidth * 4) / 4) - 11,
          right: (window.innerWidth * 4) / 2,
          bottom: (window.innerHeight * 4) / 2,
        }}
      >
        <div
          className="note-container"
          style={{
            left: props.item.xPos,
            top: props.item.yPos,
            pointerEvents: props.selectedTool === "pen" ? "none" : "all",
          }}
        >
          <textarea placeholder="Add a note..." rows="10"></textarea>
        </div>
      </Draggable>
    </div>
  );
}

export default Note;
