import { useState } from 'react'
import { Avatar, Icon } from '@ui'
import {
  CHIP_CLASS_NAME,
  DEFAULT_THEME,
  SELECTED_THEME_CONFIG,
  ChipTheme,
} from './constants'

export type ChipProps = {
  avatarSrc?: string
  children?: React.ReactNode
  className?: string
  closable?: boolean
  rounded?: boolean
  theme?: ChipTheme
  selected?: boolean
  onClick?: () => void
}

export function Chip({
  avatarSrc,
  children,
  className = '',
  closable = false,
  rounded = true,
  theme = 'primary',
  onClick,
  selected: propSelected = false,
  ...attributes
}: ChipProps) {
  const [selected, setSelected] = useState(propSelected)
  const classNames = [
    className,
    CHIP_CLASS_NAME,
    rounded ? 'rounded-full' : 'rounded-2',
    selected ? SELECTED_THEME_CONFIG[theme] : DEFAULT_THEME,
  ].join(' ')

  const onToggle = () => {
    setSelected((selected) => !selected)
    onClick?.()
  }

  return (
    <div className={classNames} {...attributes} onClick={onToggle}>
      {avatarSrc && <Avatar src={avatarSrc} className="mr-2" size="sm" />}
      <div className="text-sm">{children}</div>
      {closable && (
        <Icon icon="i-mdi-close-circle" size="base" className="ml-2" />
      )}
    </div>
  )
}

export default Chip
