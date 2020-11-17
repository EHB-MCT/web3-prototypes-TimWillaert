import "./App.css";
import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Note from "./components/Note";
import Text from "./components/Text";
import Link from "./components/Link";
import Draggable from "react-draggable";
import { v4 as uuid } from "uuid";
import update from "immutability-helper";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const parentRef = useRef(null);
  const [drawColor, setDrawColor] = useState("#000");
  const [selectedTool, setSelectedTool] = useState("pan");
  const [isDrawing, setIsDrawing] = useState(false);
  const [noteList, setNoteList] = useState([]);
  const [textList, setTextList] = useState([]);
  const [linkList, setLinkList] = useState([]);
  const [linkStatus, setLinkStatus] = useState(0);
  const [linkId, setLinkId] = useState(null);

  document.title = "Whiteboard";

  //Canvas initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    canvas.width = window.innerWidth * 8;
    canvas.height = window.innerHeight * 8;
    canvas.style.width = `${window.innerWidth * 4}px`;
    canvas.style.height = `${window.innerHeight * 4}px`;
    parent.style.width = `${window.innerWidth * 4}px`;
    parent.style.height = `${window.innerHeight * 4}px`;
    canvas.style.position = "absolute";
    canvas.style.left = `${-(window.innerWidth * 4) / 2}px`;
    canvas.style.top = `${-(window.innerHeight * 4) / 2}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = drawColor;
    context.lineWidth = 7;
    context.font = "30px Arial";
    contextRef.current = context;

    drawGrid();
  }, []);

  const startLink = (nativeEvent) => {
    setSelectedTool("link");
    if (
      nativeEvent.target.type === "textarea" ||
      nativeEvent.target.type === "text"
    ) {
      setLinkStatus(1);
      setLinkId(nativeEvent.target.parentNode.id);
    } else if (nativeEvent.target.classList.contains("note-container")) {
      setLinkStatus(1);
      setLinkId(nativeEvent.target.id);
    }
  };

  const endLink = (nativeEvent) => {
    setSelectedTool("link");
    if (
      nativeEvent.target.type === "textarea" ||
      nativeEvent.target.type === "text" ||
      nativeEvent.target.classList.contains("note-container") ||
      nativeEvent.target.classList.contains("text-container")
    ) {
      if (
        nativeEvent.target.id !== linkId &&
        nativeEvent.target.parentNode.id !== linkId
      ) {
        setLinkStatus(0);
        setSelectedTool(null);
        let item = {
          id1: linkId,
          id2: nativeEvent.target.id || nativeEvent.target.parentNode.id,
        };
        let list = linkList.concat(item);
        setLinkList(list);
      }
    }
  };

  const deleteItem = (nativeEvent) => {
    setSelectedTool("delete");
    if (nativeEvent.target.type !== "svg") {
      //remove link
      if (nativeEvent.target.parentNode.className.baseVal === "svgWrapper") {
        const id1 = nativeEvent.target.classList[1];
        const id2 = nativeEvent.target.classList[2];
        const element = linkList.find(
          (element) => element.id1 === id1 && element.id2 === id2
        );
        const newList = update(linkList, {
          $splice: [[linkList.indexOf(element), 1]],
        });
        setLinkList(newList);
      } else if (nativeEvent.target.type === "text") {
        //remove text element
        const id = nativeEvent.target.parentNode.id;

        //remove links
        const links = linkList.filter((element) =>
          element.id1 === id || element.id2 === id ? true : false
        );
        let newLinkList = [...linkList];
        for (let link of links) {
          newLinkList = update(newLinkList, {
            $splice: [[newLinkList.indexOf(link), 1]],
          });
        }
        setLinkList(newLinkList);

        //remove actual text element
        const element = textList.find((element) => element.id === id);
        const newTextList = update(textList, {
          $splice: [[textList.indexOf(element), 1]],
        });
        setTextList(newTextList);
      } else if (
        nativeEvent.target.type === "textarea" ||
        nativeEvent.target.classList.contains("note-container")
      ) {
        //remove note element
        const id = nativeEvent.target.id || nativeEvent.target.parentNode.id;

        //remove links
        const links = linkList.filter((element) =>
          element.id1 === id || element.id2 === id ? true : false
        );
        let newLinkList = [...linkList];
        for (let link of links) {
          newLinkList = update(newLinkList, {
            $splice: [[newLinkList.indexOf(link), 1]],
          });
        }
        setLinkList(newLinkList);

        //remove actual note element
        const element = noteList.find((element) => element.id === id);
        const newNoteList = update(noteList, {
          $splice: [[noteList.indexOf(element), 1]],
        });
        setNoteList(newNoteList);
      }
    }
  };

  const mouseDown = ({ nativeEvent }) => {
    switch (selectedTool) {
      case "pen":
        startDrawing(nativeEvent);
        break;
      case "note":
        addNote(nativeEvent);
        break;
      case "text":
        addText(nativeEvent);
        break;
      case "link":
        linkStatus === 0 ? startLink(nativeEvent) : endLink(nativeEvent);
        break;
      case "delete":
        deleteItem(nativeEvent);
        break;
      case null:
        setSelectedTool("pan");
        break;
      default:
        break;
    }
  };

  const mouseUp = () => {
    switch (selectedTool) {
      case "pen":
        finishDrawing();
        break;
      default:
        break;
    }
  };

  const mouseMove = ({ nativeEvent }) => {
    switch (selectedTool) {
      case "pen":
        draw(nativeEvent);
        break;
      default:
        break;
    }
  };

  const addNote = (nativeEvent) => {
    let left = canvasRef.current.style.left.split("px")[0];
    let top = canvasRef.current.style.top.split("px")[0];
    let item = {
      id: uuid(),
      xPos: nativeEvent.offsetX + parseInt(left),
      yPos: nativeEvent.offsetY + parseInt(top),
      updatedX: nativeEvent.offsetX + parseInt(left),
      updatedY: nativeEvent.offsetY + parseInt(top),
      type: "note",
    };
    let list = noteList.concat(item);
    setNoteList(list);
    setSelectedTool(null);
  };

  const addText = (nativeEvent) => {
    let left = canvasRef.current.style.left.split("px")[0];
    let top = canvasRef.current.style.top.split("px")[0];
    let item = {
      id: uuid(),
      textColor: drawColor,
      xPos: nativeEvent.offsetX + parseInt(left),
      yPos: nativeEvent.offsetY + parseInt(top),
      updatedX: nativeEvent.offsetX + parseInt(left),
      updatedY: nativeEvent.offsetY + parseInt(top),
      type: "text",
    };
    let list = textList.concat(item);
    setTextList(list);
    setSelectedTool(null);
  };

  const startDrawing = (nativeEvent) => {
    if (nativeEvent.which === 3) return;
    contextRef.current.strokeStyle = drawColor;
    contextRef.current.lineWidth = 7;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (nativeEvent) => {
    if (!isDrawing) return;
    contextRef.current.strokeStyle = drawColor;
    contextRef.current.lineWidth = 7;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const drawGrid = () => {
    var bw = window.innerWidth * 5;
    var bh = window.innerHeight * 5;

    for (var x = 0; x <= bw; x += 180) {
      contextRef.current.moveTo(x, 0);
      contextRef.current.lineTo(x, bh);
    }

    for (var x = 0; x <= bh; x += 180) {
      contextRef.current.moveTo(0, x);
      contextRef.current.lineTo(bw, x);
    }

    contextRef.current.strokeStyle = "rgb(220, 220, 220)";
    contextRef.current.lineWidth = 2;
    contextRef.current.stroke();
  };

  return (
    <div>
      <div id="fadeIn"></div>
      <Sidebar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        drawColor={drawColor}
        setDrawColor={setDrawColor}
      />
      {selectedTool === "link" && (
        <span id="linkStatus">
          <div>
            {linkStatus === 0 && <p>Select first element</p>}
            {linkStatus === 1 && <p>Select second element</p>}
          </div>
        </span>
      )}
      <div
        ref={parentRef}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
      >
        <Draggable
          disabled={selectedTool !== "pan"}
          bounds={{
            top: -((window.innerHeight * 4) / 4) - 11,
            left: -((window.innerWidth * 4) / 4) - 11,
            right: (window.innerWidth * 4) / 2,
            bottom: (window.innerHeight * 4) / 2,
          }}
        >
          <div>
            {noteList.map((item, index) => (
              <Note
                key={index}
                item={item}
                index={index}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                noteList={noteList}
                setNoteList={setNoteList}
              />
            ))}
            {textList.map((item, index) => (
              <Text
                key={index}
                item={item}
                index={index}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                textList={textList}
                setTextList={setTextList}
              />
            ))}
            <svg
              className="svgWrapper"
              style={{
                width: `${window.innerWidth * 4}px`,
                height: `${window.innerHeight * 4}px`,
                left: `${-(window.innerWidth * 4) / 2}px`,
                top: `${-(window.innerHeight * 4) / 2}px`,
                pointerEvents: selectedTool === "delete" ? "all" : "none",
              }}
            >
              {linkList.map((item, index) => (
                <Link
                  key={index}
                  item={item}
                  noteList={noteList}
                  textList={textList}
                  canvasRef={canvasRef}
                  selectedTool={selectedTool}
                />
              ))}
            </svg>
            <canvas ref={canvasRef} className={selectedTool}></canvas>
          </div>
        </Draggable>
      </div>
    </div>
  );
}

export default App;
