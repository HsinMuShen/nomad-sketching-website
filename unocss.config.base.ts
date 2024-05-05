import { UserConfig, presetTypography } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetUnocssIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetRemToPx from '@unocss/preset-rem-to-px'
import transformerDirective from '@unocss/transformer-directives'

export const PRESET = {
  TYPOGRAPHY: presetTypography(),
  UNO: presetUno(),
  REM_TO_PX: presetRemToPx(),
  ICON: presetUnocssIcons(),
  FONT: presetWebFonts({
    provider: 'none',
    fonts: {
      default:
        "'Helvetica Neue', 'Helvetica', 'Arial', 'PingFang HK', 'PingFang-SC-Regular', 'PingFang', 'Hiragino Sans GB', 'STHeiti', 'Microsoft JhengHei', sans-serif",
      sans: "ui-sans-serif, system-ui, BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
      mono: 'ui-monospace, monospace',
    },
  }),
}

const config = {
  rules: [
    ['grid-cols-auto-fit-240', { 'grid-template-columns': 'repeat(auto-fit, 240px)' }],
    ['grid-cols-auto-fill-240', { 'grid-template-columns': 'repeat(auto-fill, 240px)' }],
  ],
  presets: Object.values(PRESET),
  transformers: [transformerDirective()],
  theme: {
    colors: {
      primary: {
        10: '#FEF0F0',
        50: '#FFDFDF',
        200: '#FFAFAF',
        400: '#FF7F7F',
        500: '#FF5F5F',
        600: '#F25A5A',
        800: '#CC4C4C',
      },
      secondary: {
        10: '#E6FAF8',
        50: '#CCF4F1',
        200: '#80E4DC',
        400: '#35D5C7',
        500: '#02CAB9',
        600: '#02C0B0',
        800: '#02A294',
      },
    },
    boxShadow: {
      default: '0 2px 4px rgba(0, 0, 0, 0.05)',
      hover: '2px 2px 4px rgba(0, 0, 0, 0.20)',
      dialog: '0 0 8px rgba(0, 0, 0, 0.20)',
    },
    extend: {
      gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fit-100': 'repeat(auto-fit, minmax(100px, 1fr))',
      },
    },
  },
} as UserConfig

export default config
