import * as fabric from 'fabric'
import { IconButton } from '@ui'

type DashboardProps = {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>
  brushWidth: number
  setBrushWidth: React.Dispatch<React.SetStateAction<number>>
  undo: () => void
  redo: () => void
}

const Dashboard = ({ fabricCanvasRef, brushWidth, setBrushWidth, undo, redo }: DashboardProps) => {
  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
  }

  const changeBrushWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushWidth(parseInt(e.target.value, 10))
  }

  return (
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
        <input type="range" min="1" max="10" value={brushWidth} onChange={changeBrushWidth} className="mt-2 mb-2" />
      </div>
      <IconButton
        aria-label="undo"
        icon="i-mdi-undo-variant"
        size="2xl"
        variant="plain"
        hasPadding={false}
        onClick={undo}
      />
      <IconButton
        aria-label="redo"
        icon="i-mdi-redo-variant"
        size="2xl"
        variant="plain"
        hasPadding={false}
        onClick={redo}
      />
    </div>
  )
}

export default Dashboard
