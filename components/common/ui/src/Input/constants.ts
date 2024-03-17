export type Variant = 'outlined' | 'transparent' | 'underlined'

type StyleConfigKey = 'input' | 'wrapper'

type StyleConfig = {
  [key in StyleConfigKey]: string
}

const SHARED_STYLE_CONFIG: StyleConfig = {
  input: 'w-full focus:outline-none appearance-none border-none',
  wrapper: 'flex items-center py-2',
}

const OUTLINED_STYLE_CONFIG: StyleConfig = {
  input: SHARED_STYLE_CONFIG.input,
  wrapper: [
    SHARED_STYLE_CONFIG.wrapper,
    'px-3 border-solid border-1 border-neutral-200 shadow-neutral-200 shadow-sm rounded-md overflow-auto focus-within:border-secondary-500',
  ].join(' '),
}

const TRANSPARENT_STYLE_CONFIG: StyleConfig = {
  input: SHARED_STYLE_CONFIG.input,
  wrapper: [
    SHARED_STYLE_CONFIG.wrapper,
    'px-3 bg-transparent border-transparent',
  ].join(' '),
}

const UNDERLINED_STYLE_CONFIG: StyleConfig = {
  input: SHARED_STYLE_CONFIG.input,
  wrapper: [
    SHARED_STYLE_CONFIG.wrapper,
    'border-b-1 border-b-solid border-gray-300',
  ].join(' '),
}

export const VARIANT_STYLE_CONFIGS: {
  [key in Variant]: StyleConfig
} = {
  outlined: OUTLINED_STYLE_CONFIG,
  transparent: TRANSPARENT_STYLE_CONFIG,
  underlined: UNDERLINED_STYLE_CONFIG,
}
