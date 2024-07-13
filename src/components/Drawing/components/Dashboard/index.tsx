import * as fabric from 'fabric'
import { IconButton } from '@ui'

type DashboardProps = {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>
  brushWidth: number
  setBrushWidth: React.Dispatch<React.SetStateAction<number>>
  isEraser: boolean
  setIsEraser: React.Dispatch<React.SetStateAction<boolean>>
  undo: () => void
  redo: () => void
  redoDisabled: boolean
  clearCanvas: () => void
  downloadImage: () => void
}

const Dashboard = ({
  fabricCanvasRef,
  brushWidth,
  setBrushWidth,
  isEraser,
  setIsEraser,
  undo,
  redo,
  redoDisabled,
  clearCanvas,
  downloadImage,
}: DashboardProps) => {
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
      <IconButton
        aria-label="eraser"
        icon="i-mdi-eraser"
        color="secondary"
        size="2xl"
        variant="plain"
        hasPadding={false}
        onClick={() => setIsEraser(true)}
        disabled={isEraser}
      />
      <IconButton
        aria-label="draw"
        icon="i-mdi-draw"
        color="secondary"
        size="2xl"
        variant="plain"
        hasPadding={false}
        onClick={() => setIsEraser(false)}
        disabled={!isEraser}
      />
      <IconButton
        aria-label="download-image"
        icon="i-mdi-download"
        color="secondary"
        size="2xl"
        variant="plain"
        hasPadding={false}
        onClick={downloadImage}
      />
    </div>
  )
}

export default Dashboard
