import { Button } from '@ui'
import { PROPORTION, DEFAULT_PROPORTION_BY_WINDOW } from './constants'
import { useEffect, useState } from 'react'

type ProportionProps = {
  setCanvasHeight: (height: number) => void
  setCanvasWidth: (width: number) => void
}

const Proportion = ({ setCanvasHeight, setCanvasWidth }: ProportionProps) => {
  const buttonClass = 'mb-1'
  const [defaultWidth, setDefaultWidth] = useState(0)
  const [defaultHeight, setDefaultHeight] = useState(0)

  const updateProportion = (proportion: number) => {
    if (defaultHeight / defaultWidth == proportion) return
    if (defaultHeight / defaultWidth < proportion) {
      setCanvasHeight(0)
      setCanvasWidth(defaultHeight / proportion)
    }
    if (defaultHeight / defaultWidth > proportion) {
      setCanvasHeight(defaultWidth * proportion)
      setCanvasWidth(defaultWidth)
    }
  }

  const resetProportion = () => {
    setCanvasHeight(defaultHeight)
    setCanvasWidth(defaultWidth)
  }

  useEffect(() => {
    setDefaultWidth(window.innerWidth * DEFAULT_PROPORTION_BY_WINDOW.width)
    setDefaultHeight(window.innerHeight * DEFAULT_PROPORTION_BY_WINDOW.height)
  }, [])

  return (
    <div className="flex flex-col py-4">
      <Button variant="plain" color="secondary" className={`${buttonClass}`} onClick={resetProportion}>
        fit screen
      </Button>
      <Button
        variant="plain"
        color="secondary"
        className={`${buttonClass}`}
        onClick={() => updateProportion(PROPORTION.THREE_TO_TWO.height / PROPORTION.THREE_TO_TWO.width)}
      >
        3:2
      </Button>
      <Button
        variant="plain"
        color="secondary"
        className={`${buttonClass}`}
        onClick={() => updateProportion(PROPORTION.FIVE_TO_FOUR.height / PROPORTION.FIVE_TO_FOUR.width)}
      >
        5:4
      </Button>
    </div>
  )
}

export default Proportion
