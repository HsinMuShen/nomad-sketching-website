export const COLORS = ['primary', 'secondary'] as const
export const VARIANTS = ['solid', 'outline', 'plain', 'text', 'plain-text'] as const
export const FUNCTIONAL_COLORS = ['functional-light', 'functional-dark'] as const
export const FUNCTIONAL_VARIANTS = ['text'] as const

export type Color = (typeof COLORS)[number]
export type Variant = (typeof VARIANTS)[number]
export type FunctionalColor = (typeof FUNCTIONAL_COLORS)[number]
export type FunctionalVariant = (typeof FUNCTIONAL_VARIANTS)[number]

type ColorThemeConfig = {
  [key in Color]: {
    [key in Variant]: string
  }
}

type FunctionalColorThemeConfig = {
  [key in FunctionalColor]: {
    [key in FunctionalVariant]: string
  }
}

export const BUTTON_BASE_CONFIG =
  'min-h-4 text-3 p-0.25 cursor-pointer appearance-none border rounded border-solid outline-none transition duration-150 ease-in-out disabled:cursor-not-allowed focus:outline-none'

const SOLID_CLASS_NAME = 'border-transparent color-white disabled:bg-neutral-200'
const OUTLINE_CLASS_NAME =
  'bg-white disabled:border-neutral-200 hover:border-transparent disabled:bg-transparent disabled:color-neutral-200 hover:color-white'
const PLAIN_CLASS_NAME =
  'border-neutral-200 bg-white color-neutral-700 active:bg-neutral-200 disabled:color-neutral-200'
const TEXT_CLASS_NAME = 'border-transparent bg-transparent disabled:color-neutral-200'
const PLAIN_TEXT_CLASS_NAME = `color-neutral-700 ${TEXT_CLASS_NAME}`

export const COLOR_THEME_CONFIG: ColorThemeConfig = {
  primary: {
    solid: `bg-primary-500 active:bg-primary-800 hover:bg-primary-600 ${SOLID_CLASS_NAME}`,
    outline: `border-primary-500 color-primary-500 active:bg-primary-800 hover:bg-primary-600 ${OUTLINE_CLASS_NAME}`,
    plain: `active:color-primary-800 hover:color-primary-600 ${PLAIN_CLASS_NAME}`,
    text: `color-primary-500 active:color-primary-800 hover:color-primary-600 ${TEXT_CLASS_NAME}`,
    'plain-text': `color-neutral-700 active:color-primary-800 hover:color-primary-600 ${PLAIN_TEXT_CLASS_NAME}`,
  },
  secondary: {
    solid: `bg-secondary-500 active:bg-secondary-800 hover:bg-secondary-600 ${SOLID_CLASS_NAME}`,
    outline: `border-secondary-500 color-secondary-500 active:bg-secondary-800 hover:bg-secondary-600 ${OUTLINE_CLASS_NAME}`,
    plain: `active:color-secondary-800 hover:color-secondary-600 ${PLAIN_CLASS_NAME}`,
    text: `color-secondary-500 active:color-secondary-800 hover:color-secondary-600 ${TEXT_CLASS_NAME}`,
    'plain-text': `color-neutral-700 active:color-secondary-800 hover:color-secondary-600 ${PLAIN_TEXT_CLASS_NAME}`,
  },
}
export const FUNCTIONAL_COLOR_THEME_CONFIG: FunctionalColorThemeConfig = {
  'functional-light': {
    text: `color-white active:color-neutral-200 hover:color-neutral-100 ${TEXT_CLASS_NAME}`,
  },
  'functional-dark': {
    text: `color-neutral-700 active:color-neutral-900 hover:color-neutral-800 ${TEXT_CLASS_NAME}`,
  },
}
