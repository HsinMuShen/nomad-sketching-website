import * as fabric from 'fabric'
import { IconButton } from '@ui'

type DashboardProps = {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>
  brushWidth: number
  setBrushWidth: React.Dispatch<React.SetStateAction<number>>
  undo: () => void
  redo: () => void
  redoDisabled: boolean
}

const Dashboard = ({ fabricCanvasRef, brushWidth, setBrushWidth, undo, redo, redoDisabled }: DashboardProps) => {
  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
  }

  const changeBrushWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushWidth(parseInt(e.target.value, 10))
  }

  const getUndoDisabled = () => {
    if (!fabricCanvasRef.current) return true
    return fabricCanvasRef.current._objects.length <= 0
  }

  const undoDisabled = getUndoDisabled()

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
        disabled={undoDisabled}
      />
      <IconButton
        aria-label="redo"
        icon="i-mdi-redo-variant"
        size="2xl"
        variant="plain"
        hasPadding={false}
        onClick={redo}
        disabled={redoDisabled}
      />
    </div>
  )
}

export default Dashboard
