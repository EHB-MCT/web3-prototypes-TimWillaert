import React from "react";
import Draggable from "react-draggable";
import "./Text.css";

function Text(props) {
  console.log(props);
  return (
    <div onClick={() => props.setSelectedTool(null)}>
      <Draggable disabled={props.selectedTool === "pan"}>
        <div
          className="text-container"
          style={{
            left: props.item.xPos,
            top: props.item.yPos,
            pointerEvents: props.selectedTool === "pen" ? "none" : "all",
          }}
          id={props.item.id}
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
