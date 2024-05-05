export type ChipTheme = 'primary' | 'secondary' | 'gray'

export const CHIP_CLASS_NAME = 'inline-flex flex-items-center h-8 min-w-6 px-3 border-1 border-solid cursor-pointer'

export const DEFAULT_THEME =
  'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-900/5 hover:border-neutral-300 active:bg-neutral-900/20 active:border-neutral-400'

export const SELECTED_THEME_CONFIG = {
  primary:
    'bg-primary-500 border-primary-500 text-white hover:bg-primary-600 hover:border-primary-500 active:bg-primary-800 active:border-primary-800',
  secondary:
    'bg-secondary-500 border-secondary-500 text-white hover:bg-secondary-600 hover:border-secondary-500 active:bg-secondary-800 active:border-secondary-800',
  gray: 'bg-neutral-200 border-neutral-200 hover:bg-neutral-300 hover:border-neutral-300 active:bg-neutral-400 active:border-neutral-400',
}
