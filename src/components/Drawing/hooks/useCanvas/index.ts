import { useEffect, useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import { DEFAULT_BRUSH_WIDTH, DEFAULT_BRUSH_COLOR, DEFAULT_ERASER_COLOR } from './constants'
import { DEFAULT_PROPORTION_BY_WINDOW } from 'components/Drawing/components/Proportion/constants'

const useCanvas = (updateJsonString: (jsonString: string) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [brushWidth, setBrushWidth] = useState<number>(DEFAULT_BRUSH_WIDTH)
  const [isEraser, setIsEraser] = useState<boolean>(false)
  const [redoStack, setRedoStack] = useState<fabric.Object[]>([])

  const updateCanvasSize = useCallback(() => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.setWidth(canvasWidth)
    fabricCanvasRef.current.setHeight(canvasHeight)
    fabricCanvasRef.current.calcOffset()
  }, [canvasWidth, canvasHeight])

  const updateCanvasHistory = useCallback(() => {
    if (!fabricCanvasRef.current) return
    setRedoStack([])

    const json = fabricCanvasRef.current.toJSON()
    updateJsonString(JSON.stringify(json))
  }, [updateJsonString])

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

  const downloadImage = () => {
    if (!fabricCanvasRef.current) return

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'jpeg',
      quality: 1,
      multiplier: 1,
      enableRetinaScaling: true,
    })

    const link = document.createElement('a')
    link.download = 'canvas-image.jpg'
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
    setRedoStack([])
    fabricCanvasRef.current.backgroundColor = DEFAULT_ERASER_COLOR
  }

  const saveCanvasAsJson = () => {
    if (!fabricCanvasRef.current) return
    const json = fabricCanvasRef.current.toJSON()
    localStorage.setItem('canvasState', JSON.stringify(json))
  }

  const loadCanvasFromJson = () => {
    const savedState = localStorage.getItem('canvasState')
    if (!savedState || !fabricCanvasRef.current) return
    fabricCanvasRef.current.loadFromJSON(savedState, () => fabricCanvasRef.current?.renderAll())
  }

  useEffect(() => {
    if (!canvasRef.current) return
    if (fabricCanvasRef.current) return

    setCanvasWidth(window.innerWidth * DEFAULT_PROPORTION_BY_WINDOW.width)
    setCanvasHeight(window.innerHeight * DEFAULT_PROPORTION_BY_WINDOW.height)

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
    updateCanvasSize()
  }, [updateCanvasSize])

  useEffect(() => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.on('path:created', updateCanvasHistory)
  }, [updateCanvasHistory])

  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return
    fabricCanvasRef.current.freeDrawingBrush.width = brushWidth

    if (isEraser) fabricCanvasRef.current.freeDrawingBrush.color = DEFAULT_ERASER_COLOR
    if (!isEraser) fabricCanvasRef.current.freeDrawingBrush.color = DEFAULT_BRUSH_COLOR

    loadCanvasFromJson()
  }, [brushWidth, isEraser])

  return {
    canvasRef,
    fabricCanvasRef,
    brushWidth,
    setBrushWidth,
    setCanvasWidth,
    setCanvasHeight,
    isEraser,
    setIsEraser,
    clearCanvas,
    undo,
    redo,
    redoStack,
    downloadImage,
    saveCanvasAsJson,
    loadCanvasFromJson,
  }
}

export default useCanvas
