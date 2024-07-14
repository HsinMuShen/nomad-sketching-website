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
    downloadImage,
  } = useCanvas()

  return (
    <div>
      <div className="flex items-start">
        <div className="w-70vw h-80vh mr-4">
          <canvas ref={canvasRef} width={0} height={0} className="border-2 border-solid border-gray-500" />
        </div>
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
          downloadImage={downloadImage}
        />
      </div>
    </div>
  )
}

export default DrawingPanel
