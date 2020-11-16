import React from "react";
import { useRef } from "react";
import "./Note.css";
import Draggable from "react-draggable";
import update from "immutability-helper";

function Note(props) {
  const noteRef = useRef(null);

  const updatePosition = () => {
    const transform = noteRef.current.style.transform;
    const split1 = transform.split("(");
    const split2 = split1[1].split("px");
    const xTranslate = parseInt(split2[0]);
    const yTranslate = parseInt(split2[1].split(" ")[1]);
    const updatedX = props.item.xPos + xTranslate;
    const updatedY = props.item.yPos + yTranslate;
    const newList = update(props.noteList, {
      [props.index]: {
        updatedX: { $set: updatedX },
        updatedY: { $set: updatedY },
      },
    });
    props.setNoteList(newList);
  };

  return (
    <div
      onClick={() =>
        props.selectedTool !== "link" ? props.setSelectedTool(null) : ""
      }
    >
      <Draggable
        disabled={props.selectedTool === "pan" || props.selectedTool === "link"}
        onDrag={updatePosition}
      >
        <div
          className={
            props.selectedTool === "link"
              ? "note-container linking"
              : "note-container"
          }
          style={{
            left: props.item.xPos,
            top: props.item.yPos,
            pointerEvents: props.selectedTool === "pen" ? "none" : "all",
          }}
          id={props.item.id}
          ref={noteRef}
        >
          <textarea
            placeholder="Add a note..."
            rows="10"
            disabled={props.selectedTool === "link"}
            className={props.selectedTool === "link" ? "pointer" : ""}
          ></textarea>
        </div>
      </Draggable>
    </div>
  );
}

export default Note;
