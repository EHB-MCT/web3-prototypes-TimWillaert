import React from "react";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import "./Text.css";
import update from "immutability-helper";

function Text(props) {
  const textRef = useRef(null);
  const [value, setValue] = useState(props.item.value);

  const updatePosition = () => {
    const transform = textRef.current.style.transform;
    const split1 = transform.split("(");
    const split2 = split1[1].split("px");
    const xTranslate = parseInt(split2[0]);
    const yTranslate = parseInt(split2[1].split(" ")[1]);
    const updatedX = props.item.xPos + xTranslate;
    const updatedY = props.item.yPos + yTranslate;
    const newList = update(props.textList, {
      [props.index]: {
        updatedX: { $set: updatedX },
        updatedY: { $set: updatedY },
      },
    });
    props.setTextList(newList);
  };

  const handleType = (event) => {
    setValue(event.target.value);
    const newList = update(props.textList, {
      [props.index]: {
        value: { $set: event.target.value },
      },
    });
    props.setTextList(newList);
  };

  return (
    <div
      onClick={() =>
        props.selectedTool !== "link" && props.selectedTool !== "delete"
          ? props.setSelectedTool(null)
          : ""
      }
    >
      <Draggable
        disabled={
          props.selectedTool === "pan" ||
          props.selectedTool === "link" ||
          props.selectedTool === "delete"
        }
        onDrag={updatePosition}
      >
        <div
          className={
            props.selectedTool === "link" || props.selectedTool === "delete"
              ? "text-container text-linking"
              : "text-container"
          }
          style={{
            left: props.item.xPos,
            top: props.item.yPos,
            pointerEvents: props.selectedTool === "pen" ? "none" : "all",
          }}
          id={props.item.id}
          ref={textRef}
        >
          <input
            placeholder="Text"
            style={{ color: props.item.textColor }}
            disabled={
              props.selectedTool === "link" || props.selectedTool === "delete"
            }
            className={
              props.selectedTool === "link" || props.selectedTool === "delete"
                ? "pointer"
                : ""
            }
            value={value}
            onChange={handleType}
          ></input>
        </div>
      </Draggable>
    </div>
  );
}

export default Text;
