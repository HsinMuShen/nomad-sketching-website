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
  saveCanvasAsJson: () => void
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
  saveCanvasAsJson,
}: DashboardProps) => {
  const iconClass = 'mt-1'
  const iconBlockClass = 'flex'

  const changeBrushWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushWidth(parseInt(e.target.value, 10))
  }

  const getUndoDisabled = () => {
    if (!fabricCanvasRef.current) return true
    return fabricCanvasRef.current._objects.length <= 0
  }

  const undoDisabled = getUndoDisabled()

  return (
    <div className="flex flex-col items-center p-4 b-1 b-neutral-300 rounded-2 bg-neutral-200">
      <div className="flex flex-col items-center">
        <div className="">{brushWidth}</div>
        <input type="range" min="1" max="10" value={brushWidth} onChange={changeBrushWidth} className="mt-2 mb-2" />
      </div>
      <div className={`${iconBlockClass}`}>
        <IconButton
          aria-label="undo"
          className={`${iconClass}`}
          icon="i-mdi-undo-variant"
          size="2xl"
          variant="plain"
          hasPadding={false}
          onClick={undo}
          disabled={undoDisabled}
        />
        <IconButton
          aria-label="redo"
          className={`${iconClass}`}
          icon="i-mdi-redo-variant"
          size="2xl"
          variant="plain"
          hasPadding={false}
          onClick={redo}
          disabled={redoDisabled}
        />
      </div>
      <div className={`${iconBlockClass}`}>
        <IconButton
          aria-label="eraser"
          className={`${iconClass}`}
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
          className={`${iconClass}`}
          icon="i-mdi-draw"
          color="secondary"
          size="2xl"
          variant="plain"
          hasPadding={false}
          onClick={() => setIsEraser(false)}
          disabled={!isEraser}
        />
      </div>
      <div className={`${iconBlockClass}`}>
        <IconButton
          aria-label="download-image"
          className={`${iconClass}`}
          icon="i-mdi-download"
          color="secondary"
          size="2xl"
          variant="plain"
          hasPadding={false}
          onClick={downloadImage}
        />
        <IconButton
          aria-label="image-delete"
          className={`${iconClass}`}
          icon="i-mdi-trash-can"
          size="2xl"
          variant="plain"
          hasPadding={false}
          onClick={clearCanvas}
        />
      </div>
      <div className={`${iconBlockClass}`}>
        <IconButton
          aria-label="save-json"
          className={`${iconClass} mr-7`}
          icon="i-mdi-content-save"
          color="secondary"
          size="2xl"
          variant="plain"
          hasPadding={false}
          onClick={saveCanvasAsJson}
        />
      </div>
    </div>
  )
}

export default Dashboard
