import React from "react";
import "./Link.css";

function Link(props) {
  const combinedList = [...props.textList, ...props.noteList];

  const element1 = combinedList.find(
    (element) => element.id === props.item.id1
  );
  const element2 = combinedList.find(
    (element) => element.id === props.item.id2
  );

  return (
    <line
      className={
        props.selectedTool === "delete"
          ? `delete ${element1.id} ${element2.id}`
          : `${element1.id} ${element2.id}`
      }
      x1={
        element1.type === "note"
          ? element1.updatedX + 3930
          : element1.updatedX + 4020
      }
      y1={
        element1.type === "note"
          ? element1.updatedY + 2045
          : element1.updatedY + 1980
      }
      x2={
        element2.type === "note"
          ? element2.updatedX + 3930
          : element2.updatedX + 4020
      }
      y2={
        element2.type === "note"
          ? element2.updatedY + 2045
          : element2.updatedY + 1980
      }
    />
  );
}

export default Link;
