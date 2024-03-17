export type ThemeType = 'primary' | 'secondary'

export const DEFAULT_OUTLINE = 'border-neutral-200'
export const ERROR_OUTLINE = 'border-primary-500'
export const HIDDEN_OUTLINE =
  'border-transparent hover:border-transparent focus:outline-none'

export const DEFAULT_CLASSNAMES =
  'bg-white color-neutral-700  hover:border-neutral-500'
export const DISABLED_CLASSNAMES = 'bg-light-200 color-neutral-500'
export const ACTIVE_THEME_DICT = {
  primary: 'focus:outline-primary-500 active:outline-primary-500',
  secondary: 'focus:outline-secondary-500 active:outline-secondary-500',
}

export const CONFIG_CLASSNAMES =
  'w-full border-1 rounded text-sm overflow-auto resize-y px-3 py-2 mb-1 placeholder:color-neutral-500'

export const LINE_HEIGHT = 20
export const PADDING_HEIGHT = 16
