import { useEffect, useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import Dashboard from './components/Dashboard'

const DEFAULT_BRUSH_WIDTH = 2

const DrawingPanel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [brushWidth, setBrushWidth] = useState(DEFAULT_BRUSH_WIDTH)
  const [redoStack, setRedoStack] = useState<fabric.Object[]>([])

  const updateCanvasHistory = useCallback(() => {
    if (!fabricCanvasRef.current) return
    setRedoStack([])
  }, [])

  const undo = () => {
    if (!fabricCanvasRef.current) return
    if (fabricCanvasRef.current._objects.length <= 0) return

    const newestState = fabricCanvasRef.current._objects.pop()
    if (!newestState) return

    setRedoStack((prev) => [...prev, newestState])
    fabricCanvasRef.current.renderAll()
  }

  const redo = () => {
    if (!fabricCanvasRef.current) return
    if (redoStack.length <= 0) return

    const tempRedoStack = redoStack
    const newState = tempRedoStack.pop()
    if (!newState) return

    setRedoStack([...tempRedoStack])
    fabricCanvasRef.current.add(newState)
  }

  useEffect(() => {
    if (!canvasRef.current) return
    if (fabricCanvasRef.current) return
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    })
    fabricCanvasRef.current = canvas

    const brush = new fabric.PencilBrush(canvas)
    brush.color = 'black'
    brush.width = DEFAULT_BRUSH_WIDTH
    canvas.freeDrawingBrush = brush

    return () => {
      if (!fabricCanvasRef.current) return
      fabricCanvasRef.current.dispose()
      fabricCanvasRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.on('path:created', updateCanvasHistory)
  }, [updateCanvasHistory])

  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return
    fabricCanvasRef.current.freeDrawingBrush.width = brushWidth
  }, [brushWidth])

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={600} className="border-2 border-solid border-gray-500"></canvas>
      <Dashboard
        fabricCanvasRef={fabricCanvasRef}
        brushWidth={brushWidth}
        setBrushWidth={setBrushWidth}
        undo={undo}
        redo={redo}
        redoDisabled={redoStack.length <= 0}
      />
    </div>
  )
}

export default DrawingPanel
