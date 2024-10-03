import type { DirectionType, OrientationType, OffsetConfig, TooltipPositionConfig } from './types'
import { getChevronPositionStyle } from './utils'

export const Direction = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
} as const

export const Position = {
  Start: 'start',
  Center: 'center',
  End: 'end',
} as const

export const Orientation = {
  Landscape: 'landscape',
  Portrait: 'portrait',
} as const

export const CssPosition = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
} as const

export const THEME_CONFIG = {
  dark: {
    background: 'bg-neutral-900/80',
    title: 'text-white',
    description: 'text-light-400',
    tag: 'text-light-400 bg-neutral-700',
    shadow: '',
    chevronFill: '#171717',
  },
  light: {
    background: 'bg-white/80',
    title: 'text-neutral-700',
    description: 'text-neutral-500',
    tag: 'text-neutral-500 bg-neutral-100',
    shadow: 'drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]',
    chevronFill: 'white',
  },
}

export const CHEVRON_WIDTH = 10
export const CHEVRON_HEIGHT = 7
export const CHEVRON_MARGIN = 8
export const CHEVRON_OFFSET = 16

export const CHEVRON_CLASSNAME = {
  [Direction.Top]: '',
  [Direction.Right]: 'rotate-90 origin-center',
  [Direction.Bottom]: 'rotate-180 origin-center',
  [Direction.Left]: '-rotate-90 origin-center',
}
export const CHEVRON_STYLE = {
  [Direction.Top]: getChevronPositionStyle({
    direction: CssPosition.Top,
    position: CssPosition.Left,
  }),
  [Direction.Right]: getChevronPositionStyle({
    direction: CssPosition.Right,
    position: CssPosition.Top,
    transform: '0 -50%',
  }),
  [Direction.Bottom]: getChevronPositionStyle({ direction: CssPosition.Bottom, position: CssPosition.Left }),
  [Direction.Left]: getChevronPositionStyle({
    direction: CssPosition.Left,
    position: CssPosition.Top,
    transform: '0 -50%',
  }),
}

export const ORIENTATION_CONFIG: { [key in DirectionType]: OrientationType } = {
  [Direction.Top]: Orientation.Landscape,
  [Direction.Right]: Orientation.Portrait,
  [Direction.Bottom]: Orientation.Landscape,
  [Direction.Left]: Orientation.Portrait,
}

export const TOOLTIP_OFFSET_CONFIG: OffsetConfig = {
  [Orientation.Portrait]: {
    x: CHEVRON_HEIGHT + CHEVRON_MARGIN,
    y: CHEVRON_WIDTH / 2 + CHEVRON_OFFSET,
  },
  [Orientation.Landscape]: {
    x: CHEVRON_WIDTH / 2 + CHEVRON_OFFSET,
    y: CHEVRON_HEIGHT + CHEVRON_MARGIN,
  },
}

// In the following code snippet, TOOLTIP_POSITION_COEFFICIENTS_CONFIG is primarily used to store the formula coefficients for calculating the position of a tooltip relative to its target element. In the `getCoordinate` function (declared in ./utils.ts), we will utilize these configuration values to perform dot products with arrays representing the dimensions of the target element, tooltip, and the distance needed for displacement. This helps us determine the tooltip's position relative to the target element.

const DirectionTopY = [1, 0, 1]
const DirectionBottomY = [0, -1, -1]
const DirectionRightX = [0, -1, -1]
const DirectionLeftX = [1, 0, 1]
const PositionStartOrientationAxis = [0.5, 0, -1]
const PositionCenterOrientationAxis = [0.5, -0.5, 0]
const PositionEndOrientationAxis = [0.5, -1, 1]

export const TOOLTIP_POSITION_COEFFICIENTS_CONFIG: TooltipPositionConfig = {
  [Direction.Top]: {
    [Position.Start]: {
      xVector: PositionStartOrientationAxis,
      yVector: DirectionTopY,
    },
    [Position.Center]: {
      xVector: PositionCenterOrientationAxis,
      yVector: DirectionTopY,
    },
    [Position.End]: {
      xVector: PositionEndOrientationAxis,
      yVector: DirectionTopY,
    },
  },
  [Direction.Right]: {
    [Position.Start]: {
      xVector: DirectionRightX,
      yVector: PositionStartOrientationAxis,
    },
    [Position.Center]: {
      xVector: DirectionRightX,
      yVector: PositionCenterOrientationAxis,
    },
    [Position.End]: {
      xVector: DirectionRightX,
      yVector: PositionEndOrientationAxis,
    },
  },
  [Direction.Bottom]: {
    [Position.Start]: {
      xVector: PositionStartOrientationAxis,
      yVector: DirectionBottomY,
    },
    [Position.Center]: {
      xVector: PositionCenterOrientationAxis,
      yVector: DirectionBottomY,
    },
    [Position.End]: {
      xVector: PositionEndOrientationAxis,
      yVector: DirectionBottomY,
    },
  },
  [Direction.Left]: {
    [Position.Start]: {
      xVector: DirectionLeftX,
      yVector: PositionStartOrientationAxis,
    },
    [Position.Center]: {
      xVector: DirectionLeftX,
      yVector: PositionCenterOrientationAxis,
    },
    [Position.End]: {
      xVector: DirectionLeftX,
      yVector: PositionEndOrientationAxis,
    },
  },
}
