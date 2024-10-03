import type { CssPositionType, ChevronType, RectsType } from './types'
import {
  Position,
  CssPosition,
  CHEVRON_HEIGHT,
  CHEVRON_OFFSET,
  TOOLTIP_OFFSET_CONFIG,
  TOOLTIP_POSITION_COEFFICIENTS_CONFIG,
  ORIENTATION_CONFIG,
} from './constants'

type GetCoordinateProps = {
  targetRects: RectsType
  tooltipRects: RectsType
  chevron: ChevronType
}

function getDotProduct(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('vectors should has equal length')
  }
  return vectorA.reduce((acc, cur, id) => {
    acc += cur * vectorB[id]
    return acc
  }, 0)
}

export function getCoordinate({ targetRects, tooltipRects, chevron }: GetCoordinateProps) {
  const tooltipOffset = TOOLTIP_OFFSET_CONFIG[ORIENTATION_CONFIG[chevron.direction]]
  const tooltipPositionCoefficients = TOOLTIP_POSITION_COEFFICIENTS_CONFIG[chevron.direction][chevron.position]
  const params = {
    xVector: [targetRects.width, tooltipRects.width, tooltipOffset.x],
    yVector: [targetRects.height, tooltipRects.height, tooltipOffset.y],
  }
  return {
    x: targetRects.x + getDotProduct(params.xVector, tooltipPositionCoefficients.xVector),
    y: targetRects.y + getDotProduct(params.yVector, tooltipPositionCoefficients.yVector),
  }
}

export function getChevronPositionStyle({
  direction,
  position,
  transform = '',
}: {
  direction: CssPositionType
  position: CssPositionType
  transform?: string
}) {
  return {
    [Position.Start]: { [direction]: `-${CHEVRON_HEIGHT}px`, [position]: `${CHEVRON_OFFSET}px` },
    [Position.Center]: {
      [direction]: `-${CHEVRON_HEIGHT}px`,
      ...(position === CssPosition.Top || position === CssPosition.Bottom ? { top: '50%' } : {}),
      ...(transform && { transform }),
    },
    [Position.End]: {
      [direction]: `-${CHEVRON_HEIGHT}px`,
      [position === CssPosition.Left ? CssPosition.Right : CssPosition.Bottom]: `${CHEVRON_OFFSET}px`,
    },
  }
}
