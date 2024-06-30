import { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { IconButton } from '@ui'

const DEFAULT_BRUSH_WIDTH = 2

const DrawingPanel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [brushWidth, setBrushWidth] = useState(DEFAULT_BRUSH_WIDTH)

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
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
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return
    fabricCanvasRef.current.freeDrawingBrush.width = brushWidth
  }, [brushWidth])

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={600} className="border-2 border-solid border-gray-500"></canvas>
      <div className="flex items-center">
        <IconButton
          aria-label="image-delete"
          icon="i-mdi-trash-can"
          size="2xl"
          variant="plain"
          hasPadding={false}
          onClick={clearCanvas}
        />
        <div className="flex items-center mx-2">
          <div className="mr-2">Brush width: {brushWidth}</div>
          <input
            type="range"
            min="1"
            max="10"
            value={brushWidth}
            onChange={(e) => setBrushWidth(parseInt(e.target.value, 10))}
            className="mt-2 mb-2"
          />
        </div>
      </div>
    </div>
  )
}

export default DrawingPanel
