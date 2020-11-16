import React from "react";
import "./Link.css";

function Link(props) {
  const element1 = props.noteList.find(
    (element) => element.id === props.item.id1
  );
  const element2 = props.noteList.find(
    (element) => element.id === props.item.id2
  );

  console.log(element2);

  return (
    <line
      x1={element1.updatedX + 3930}
      y1={element1.updatedY + 2040}
      x2={element2.updatedX + 3930}
      y2={element2.updatedY + 2040}
    />
  );
}

export default Link;
