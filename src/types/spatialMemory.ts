export type NormalizedPoint = {
  x: number
  y: number
}

export type VanishingPoint = NormalizedPoint & {
  axis: 'a' | 'b'
}

export type PerspectiveAnnotation = {
  horizonY: number | null
  vanishingPoints: VanishingPoint[]
  facadePoints: NormalizedPoint[]
}

export const EMPTY_PERSPECTIVE_ANNOTATION: PerspectiveAnnotation = {
  horizonY: null,
  vanishingPoints: [],
  facadePoints: [],
}
