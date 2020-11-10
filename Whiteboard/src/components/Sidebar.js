import React from "react";
import { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import { SketchPicker } from "react-color";
import PanToolIcon from "@material-ui/icons/PanTool";
import CreateIcon from "@material-ui/icons/Create";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import NoteIcon from "@material-ui/icons/Note";

function Sidebar(props) {
  const [isPickingColor, setIsPickingColor] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleChange = (color) => {
    props.setDrawColor(color.hex);
  };

  const handleChangeComplete = (color) => {
    props.setDrawColor(color.hex);
  };

  const toggleColorPicker = () => {
    if (!isPickingColor) {
      setIsPickingColor(true);
    } else {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsPickingColor(false);
        setIsFadingOut(false);
      }, 200);
    }
  };

  return (
    <div id="sidebar">
      <PanToolIcon
        onClick={() => props.setSelectedTool("pan")}
        className={props.selectedTool === "pan" ? "active" : ""}
      />
      <CreateIcon
        onClick={() => props.setSelectedTool("pen")}
        className={props.selectedTool === "pen" ? "active" : ""}
      />
      <div
        id="drawColor"
        style={{ backgroundColor: props.drawColor }}
        onClick={toggleColorPicker}
      ></div>
      {isPickingColor && (
        <SketchPicker
          className={isFadingOut ? "fadeOut" : ""}
          color={props.drawColor}
          onChangeComplete={handleChangeComplete}
          onChange={handleChange}
        />
      )}
      <TextFieldsIcon
        onClick={() => props.setSelectedTool("text")}
        className={props.selectedTool === "text" ? "active" : ""}
      />
      <NoteIcon
        onClick={() => props.setSelectedTool("note")}
        className={props.selectedTool === "note" ? "active" : ""}
      />
    </div>
  );
}

export default Sidebar;
