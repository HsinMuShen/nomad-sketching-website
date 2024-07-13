import { useEffect, useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import { DEFAULT_BRUSH_WIDTH, DEFAULT_BRUSH_COLOR, DEFAULT_ERASER_COLOR } from './constants'

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [brushWidth, setBrushWidth] = useState<number>(DEFAULT_BRUSH_WIDTH)
  const [isEraser, setIsEraser] = useState<boolean>(false)
  const [redoStack, setRedoStack] = useState<fabric.Object[]>([])

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
    setRedoStack([])
    fabricCanvasRef.current.backgroundColor = DEFAULT_ERASER_COLOR
  }

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
    brush.color = DEFAULT_BRUSH_COLOR
    brush.width = DEFAULT_BRUSH_WIDTH
    canvas.freeDrawingBrush = brush
    canvas.backgroundColor = DEFAULT_ERASER_COLOR

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

    if (isEraser) fabricCanvasRef.current.freeDrawingBrush.color = DEFAULT_ERASER_COLOR
    if (!isEraser) fabricCanvasRef.current.freeDrawingBrush.color = DEFAULT_BRUSH_COLOR
  }, [brushWidth, isEraser])

  return {
    canvasRef,
    fabricCanvasRef,
    brushWidth,
    setBrushWidth,
    isEraser,
    setIsEraser,
    clearCanvas,
    undo,
    redo,
    redoStack,
  }
}

export default useCanvas
