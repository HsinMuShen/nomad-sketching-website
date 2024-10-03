import { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { DEFAULT_BRUSH_WIDTH, DEFAULT_BRUSH_COLOR, DEFAULT_ERASER_COLOR } from './constants'

type Props = {
  loadedJson?: string
}

const useCanvas = ({ loadedJson }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [brushWidth, setBrushWidth] = useState<number>(DEFAULT_BRUSH_WIDTH)
  const [isEraser, setIsEraser] = useState<boolean>(false)
  const [redoStack, setRedoStack] = useState<fabric.Object[]>([])

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

  const getImageFile = async () => {
    if (!fabricCanvasRef.current) return null

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'jpeg',
      quality: 1,
      multiplier: 1,
      enableRetinaScaling: true,
    })

    const response = await fetch(dataURL)
    const blob = await response.blob()

    return new File([blob], 'canvas-image.jpeg', { type: 'image/jpeg' })
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

  const getCanvasJson = () => {
    if (!fabricCanvasRef.current) return
    const json = fabricCanvasRef.current.toJSON()
    return JSON.stringify(json)
  }

  const saveCanvasAsJson = () => {
    if (!fabricCanvasRef.current) return
    const json = fabricCanvasRef.current.toJSON()
    localStorage.setItem('canvasState', JSON.stringify(json))
  }

  useEffect(() => {
    if (!canvasRef.current) return
    if (fabricCanvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 560,
      height: 700,
      backgroundColor: DEFAULT_ERASER_COLOR,
    })

    const brush = new fabric.PencilBrush(canvas)
    brush.color = DEFAULT_BRUSH_COLOR
    brush.width = DEFAULT_BRUSH_WIDTH
    canvas.freeDrawingBrush = brush

    canvas.on('path:created', () => {
      setRedoStack([])
    })

    fabricCanvasRef.current = canvas

    if (loadedJson) {
      canvas.loadFromJSON(loadedJson, () => {
        console.log('Canvas loaded from JSON', loadedJson)
        canvas.renderAll()
        requestAnimationFrame(() => {
          canvas.isDrawingMode = true
          canvas.renderAll()
        })
      })
    } else {
      canvas.renderAll()
    }

    return () => {
      if (!fabricCanvasRef.current) return
      fabricCanvasRef.current.dispose()
      fabricCanvasRef.current = null
    }
  }, [loadedJson])

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
    downloadImage,
    saveCanvasAsJson,
    getImageFile,
    getCanvasJson,
  }
}

export default useCanvas
