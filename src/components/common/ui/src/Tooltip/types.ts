import { Direction, Position, Orientation, CssPosition } from './constants'

type ValueOf<T> = T[keyof T]
export type DirectionType = ValueOf<typeof Direction>
type PositionType = ValueOf<typeof Position>
export type OrientationType = ValueOf<typeof Orientation>
export type SizeType = 'sm' | 'lg'
export type ThemeType = 'dark' | 'light'
export type ChevronType = {
  direction: DirectionType
  position: PositionType
}
export type CssPositionType = ValueOf<typeof CssPosition>
export type RectsType = {
  width: number
  height: number
  x: number
  y: number
}

export type OffsetConfig = {
  [key in OrientationType]: { x: number; y: number }
}

export type TooltipPositionConfig = {
  [key in DirectionType]: {
    [key in PositionType]: {
      xVector: number[]
      yVector: number[]
    }
  }
}
