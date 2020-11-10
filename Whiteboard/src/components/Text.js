import React from "react";
import Draggable from "react-draggable";
import "./Text.css";

function Text(props) {
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
          className="text-container"
          style={{
            left: props.item.xPos,
            top: props.item.yPos,
            pointerEvents: props.selectedTool === "pen" ? "none" : "all",
          }}
        >
          <input
            placeholder="Text"
            style={{ color: props.item.textColor }}
          ></input>
        </div>
      </Draggable>
    </div>
  );
}

export default Text;
