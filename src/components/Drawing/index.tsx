import { useState, ForwardedRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import Joyride from 'react-joyride'
import Dashboard from './components/Dashboard'
// import Proportion from './components/Proportion'
import useCanvas from './hooks/useCanvas'
import { Steps } from './constants'

type DrawingPanelProps = {
  showingTour?: boolean
  loadedJson?: string
}

const DrawingPanelWrap = ({ showingTour = false, loadedJson }: DrawingPanelProps, ref: ForwardedRef<unknown>) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isTourRunning, setIsTourRunning] = useState(true)
  const [tourWidth, setTourWidth] = useState(300)
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

  const shouldShowTour = showingTour && isMounted

  const tourStyles = {
    options: {
      primaryColor: '#444',
      width: tourWidth,
      zIndex: 5,
    },
  }
  const tourCallback = (data: { status: string }) => {
    const { status } = data
    if (status === 'finished' || status === 'skipped') setIsTourRunning(false)
  }

  useImperativeHandle(ref, () => ({
    getCanvasJson,
    getImageFile,
  }))

  useEffect(() => {
    setIsMounted(true)
    const handleResize = () => {
      setTourWidth(window.innerWidth < 480 ? 250 : 300)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="mt-[-120px] w-full flex items-center justify-center scale-50 xs:mt-0 xs:scale-70 ssm:scale-75 sm:scale-90 md:scale-100">
      {shouldShowTour && (
        <Joyride
          steps={Steps}
          run={isTourRunning}
          hideCloseButton
          continuous
          scrollToFirstStep
          showSkipButton
          showProgress
          styles={tourStyles}
          callback={tourCallback}
        />
      )}
      <div className="mr-4">
        <canvas ref={canvasRef} className="canvas-element border-2 border-solid border-gray-500" />
      </div>
      <div className="ml-6 scale-170 xs:scale-130 ssm:scale-120 sm:scale-110 md:scale-100">
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
