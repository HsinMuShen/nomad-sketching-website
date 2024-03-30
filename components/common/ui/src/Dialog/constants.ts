export type Size = 'sm' | 'md' | 'lg'

type SizeConfig = {
  [key in Size]: string
}

export const SIZE_CONFIG: SizeConfig = {
  sm: 'sm:w-lg sm:max-h-5/6 h-auto',
  md: 'sm:w-2xl sm:h-5/6',
  lg: 'sm:w-4xl sm:h-5/6',
}

export const MOBILE_FULL_SCREEN = 'lt-sm:h-screen lt-sm:w-screen'
export const MOBILE_PARTIAL_SCREEN =
  'lt-sm:h-auto lt-sm:w-auto lt-sm:m-4 lt-sm:rounded-xl'
export const BACKDROP_BLUR = 'backdrop-blur-4'
export const NO_WRAP = 'whitespace-nowrap'
