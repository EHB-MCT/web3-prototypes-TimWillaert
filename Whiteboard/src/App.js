import './App.css';
import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Draggable from 'react-draggable';
import DeleteIcon from '@material-ui/icons/Delete';

function App() {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const parentRef = useRef(null)
  const [drawColor, setDrawColor] = useState('#000');
  const [selectedTool, setSelectedTool] = useState('pan');
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    canvas.width = window.innerWidth * 8;
    canvas.height = window.innerHeight * 8;
    canvas.style.width = `${window.innerWidth * 4}px`;
    canvas.style.height = `${window.innerHeight * 4}px`;
    parent.style.width = `${window.innerWidth * 4}px`;
    parent.style.height = `${window.innerHeight * 4}px`;
    canvas.style.position = 'absolute';
    canvas.style.left = `${- (window.innerWidth * 4) / 2}px`;
    canvas.style.top = `${- (window.innerHeight * 4) / 2}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = drawColor;
    context.lineWidth = 7;
    contextRef.current = context;

    drawGrid();
  }, [])

  const mouseDown = ({nativeEvent}) => {
    switch (selectedTool) {
      case 'pen':
        startDrawing(nativeEvent);
    }
  }

  const mouseUp = () => {
    switch (selectedTool) {
      case 'pen':
        finishDrawing();
    }
  }

  const mouseMove = ({nativeEvent}) => {
    switch (selectedTool) {
      case 'pen':
        draw(nativeEvent);
    }
  }

  const startDrawing = (nativeEvent) => {
    if(nativeEvent.which == 3) return;
    contextRef.current.strokeStyle = drawColor;
    contextRef.current.lineWidth = 7;
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setIsDrawing(true);
  }

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  }

  const draw = (nativeEvent) => {
    if(!isDrawing) return;
    contextRef.current.strokeStyle = drawColor;
    contextRef.current.lineWidth = 7;
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

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
  }

  const zoomCanvas = ({nativeEvent}) => {
    if(nativeEvent.wheelDelta > 0 && canvasScale < 1.5){
      setCanvasScale(canvasScale + 0.1)
    } else if(nativeEvent.wheelDelta < 0 && canvasScale > 0.5){
      setCanvasScale(canvasScale - 0.1)
    }
  }

  return (
    <div>
      <div id="fadeIn"></div>
      <Sidebar selectedTool={selectedTool} setSelectedTool={setSelectedTool} drawColor={drawColor} setDrawColor={setDrawColor}/>
      <div 
        ref={parentRef}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
        onWheel={zoomCanvas}
        style={{transform: `scale(${canvasScale})`}}>
          <Draggable 
            disabled={selectedTool != 'pan'}
            bounds={{
              top: - ((window.innerHeight * 4) / 4) - 11, 
              left: - ((window.innerWidth * 4) / 4) - 11, 
              right: (window.innerWidth * 4) / 2, 
              bottom: (window.innerHeight * 4) / 2
            }}
            scale={canvasScale}>
              <canvas ref={canvasRef} className={selectedTool == 'pan' ? 'draggable' : 'not-draggable'}/>
          </Draggable>
      </div>
    </div>
  );
}

//style={{transform: `scale(${canvasScale})`}}

export default App;
