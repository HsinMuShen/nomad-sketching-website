import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import Dashboard from './components/Dashboard'
// import Proportion from './components/Proportion'
import useCanvas from './hooks/useCanvas'

type DrawingPanelProps = {
  loadedJson?: string
}

const DrawingPanelWrap = ({ loadedJson }: DrawingPanelProps, ref: ForwardedRef<unknown>) => {
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
    saveCanvasAsJson,
    getImageFile,
    getCanvasJson,
  } = useCanvas({ loadedJson })

  useImperativeHandle(ref, () => ({
    getCanvasJson,
    getImageFile,
  }))

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mr-4">
        <canvas ref={canvasRef} className="border-2 border-solid border-gray-500" />
      </div>
      <div className="flex flex-col items-center px-2">
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
          saveCanvasAsJson={saveCanvasAsJson}
        />
        {/* <Proportion setCanvasHeight={setCanvasHeight} setCanvasWidth={setCanvasWidth} /> */}
      </div>
    </div>
  )
}

const DrawingPanel = forwardRef(DrawingPanelWrap)

export default DrawingPanel
