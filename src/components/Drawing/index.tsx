import Dashboard from './components/Dashboard'
import useCanvas from './hooks/useCanvas'

const DrawingPanel: React.FC = () => {
  const {
    canvasRef,
    fabricCanvasRef,
    brushWidth,
    setBrushWidth,
    undo,
    redo,
    redoStack,
    isEraser,
    setIsEraser,
    clearCanvas,
  } = useCanvas()

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={600} className="border-2 border-solid border-gray-500"></canvas>
      <Dashboard
        fabricCanvasRef={fabricCanvasRef}
        brushWidth={brushWidth}
        setBrushWidth={setBrushWidth}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        undo={undo}
        redo={redo}
        redoDisabled={redoStack.length <= 0}
        clearCanvas={clearCanvas}
      />
    </div>
  )
}

export default DrawingPanel
