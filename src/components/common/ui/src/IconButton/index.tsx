import type { Color, Variant, FunctionalColor, FunctionalVariant } from './constants'
import type { Size } from '../Icon'
import { ButtonHTMLAttributes } from 'react'
import { Icon, IconProps } from 'src/components/common/ui'
import { BUTTON_BASE_CONFIG, FUNCTIONAL_COLORS, COLOR_THEME_CONFIG, FUNCTIONAL_COLOR_THEME_CONFIG } from './constants'

type LoadingProps = { size: Size }

function Loading({ size }: LoadingProps) {
  return <Icon icon="i-mdi-loading" size={size} className="ma-auto rotate-360 animate-spin" />
}

type IconButtonColor = Color | FunctionalColor

export type IconButtonProps = {
  size?: Size
  color?: IconButtonColor
  variant?: Variant
  hasPadding?: boolean
  rounded?: boolean
  disabled?: boolean
  isLoading?: boolean
} & IconProps &
  ButtonHTMLAttributes<HTMLButtonElement>

export function IconButton({
  icon,
  size = 'xl',
  color = 'primary',
  variant = 'solid',
  className = '',
  hasPadding = true,
  rounded = false,
  disabled = false,
  isLoading = false,
  ...attributes
}: IconButtonProps) {
  const themeConfig = FUNCTIONAL_COLORS.includes(color as FunctionalColor)
    ? FUNCTIONAL_COLOR_THEME_CONFIG[color as FunctionalColor][variant as FunctionalVariant]
    : COLOR_THEME_CONFIG[color as Color][variant as Variant]
  const classNames = [
    BUTTON_BASE_CONFIG,
    themeConfig,
    rounded && 'rounded-full',
    hasPadding && 'p-1.75',
    className,
  ].join(' ')
  return (
    <button className={classNames} disabled={disabled} {...attributes}>
      {isLoading ? <Loading size={size} /> : <Icon icon={icon} size={size} className="ma-auto" />}
    </button>
  )
}

export default IconButton
