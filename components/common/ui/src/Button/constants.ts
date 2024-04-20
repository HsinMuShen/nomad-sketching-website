export type ColorTheme = 'primary' | 'secondary'
export type Variant = 'solid' | 'outline' | 'plain' | 'text' | 'plain-text'

type ThemeConfig = {
  [key in ColorTheme]: {
    [key in Variant]: string
  }
}

const SOLID_CLASS_NAMES = 'color-white border-transparent disabled:bg-neutral-200'
const OUTLINE_CLASS_NAMES =
  'bg-white hover:color-white hover:border-transparent disabled:color-neutral-200 disabled:border-neutral-200 disabled:bg-white'
const PLAIN_CLASS_NAMES =
  'color-neutral-700 border-neutral-200 bg-white active:bg-neutral-200 disabled:color-neutral-200'
const TEXT_CLASS_NAMES =
  'bg-transparent border-transparent hover:bg-neutral-900/5 active:bg-neutral-900/20 disabled:color-neutral-200'
const PLAIN_TEXT_CLASS_NAMES = `color-neutral-700 ${TEXT_CLASS_NAMES}`

export const BUTTON_THEME_CONFIG: ThemeConfig = {
  primary: {
    solid: `bg-primary-500 hover:bg-primary-600 active:bg-primary-800 ${SOLID_CLASS_NAMES}`,
    outline: `color-primary-500 border-primary-500 hover:bg-primary-600 active:bg-primary-800 ${OUTLINE_CLASS_NAMES}`,
    plain: `hover:color-primary-600 active:color-primary-800 ${PLAIN_CLASS_NAMES}`,
    text: `color-primary-500 hover:color-primary-600 active:color-primary-800 ${TEXT_CLASS_NAMES}`,
    'plain-text': `color-neutral-700 hover:color-primary-600 active:color-primary-800 ${PLAIN_TEXT_CLASS_NAMES}`,
  },
  secondary: {
    solid: `bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-800 ${SOLID_CLASS_NAMES}`,
    outline: `color-secondary-500 border-secondary-500 hover:bg-secondary-600 active:bg-secondary-800 ${OUTLINE_CLASS_NAMES}`,
    plain: `hover:color-secondary-600 active:color-secondary-800 ${PLAIN_CLASS_NAMES}`,
    text: `color-secondary-500 hover:color-secondary-600 active:color-secondary-800 ${TEXT_CLASS_NAMES}`,
    'plain-text': `color-neutral-700 hover:color-secondary-600 active:color-secondary-800 ${PLAIN_TEXT_CLASS_NAMES}`,
  },
}

export const BUTTON_CLASS_NAMES =
  'relative min-h-9 min-w-20 px-4 py-1.5 inline-flex items-center justify-center border text-sm leading-4 font-normal rounded appearance-none border-solid outline-none transition duration-150 ease-in-out cursor-pointer focus:outline-none disabled:cursor-not-allowed'
