import { ButtonHTMLAttributes } from 'react'
import { Icon } from 'src/components/common/ui'
import { ColorTheme, Variant, BUTTON_THEME_CONFIG, BUTTON_CLASS_NAMES } from './constants'

export type ButtonProps = {
  children?: React.ReactNode
  color?: ColorTheme
  prefixIcon?: string
  suffixIcon?: string
  disabled?: boolean
  isLoading?: boolean
  variant?: Variant
  onClick: () => void
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

function Loading({ isLoading }: { isLoading: boolean }) {
  const visibility = isLoading ? 'visible' : 'invisible'
  return <Icon icon="i-mdi-loading" size="xl" className={`absolute rotate-360 animate-spin ${visibility}`} />
}

export function Button({
  color = 'primary',
  prefixIcon,
  suffixIcon,
  isLoading = false,
  disabled = false,
  onClick,
  children,
  variant = 'solid',
  className = '',
  ...attributes
}: ButtonProps) {
  const themeConfig = BUTTON_THEME_CONFIG[color][variant]

  const classNames = [BUTTON_CLASS_NAMES, themeConfig, className].join(' ')

  const prefixIconNode = prefixIcon ? <Icon icon={prefixIcon} size="xl" className="mr-2" /> : null
  const suffixIconNode = suffixIcon ? <Icon icon={suffixIcon} size="xl" className="ml-2" /> : null

  const Content = ({ isLoading }: { isLoading: boolean }) => {
    const visibility = isLoading ? 'invisible' : 'visible'
    return (
      <span className={`inline-flex justify-center items-center ${visibility}`}>
        {prefixIconNode}
        {children}
        {suffixIconNode}
      </span>
    )
  }
  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isLoading) return
    onClick(event)
  }

  return (
    <button className={classNames} disabled={disabled} onClick={onButtonClick} {...attributes}>
      <Content isLoading={isLoading} />
      <Loading isLoading={isLoading} />
    </button>
  )
}

export default Button
