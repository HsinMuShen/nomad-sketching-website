import { InputHTMLAttributes } from 'react'
import { Icon } from 'src/components/common/ui'
import { Variant, VARIANT_STYLE_CONFIGS } from './constants'

export type InputProps = {
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
  placeholder?: string
  variant?: Variant
  disabled?: boolean
  readOnly?: boolean
  className?: string
  prefixIcon?: string
  suffixIcon?: string
} & InputHTMLAttributes<HTMLInputElement>

export function Input({
  value,
  onChange,
  onValueChange,
  placeholder,
  variant = 'outlined',
  disabled = false,
  readOnly = false,
  className = '',
  prefixIcon,
  suffixIcon,
  ...attributes
}: InputProps) {
  const currentStyleConfig = VARIANT_STYLE_CONFIGS[variant]
  const inputClassNames = [currentStyleConfig.input, readOnly ? 'cursor-pointer' : ''].join(' ')
  const wrapperClassNames = [
    currentStyleConfig.wrapper,
    disabled ? ' bg-light-200 text-neutral-500 cursor-not-allowed' : 'cursor-pointer',
    className,
  ].join(' ')

  const iconColor = disabled ? 'text-neutral-200' : 'text-neutral-700'
  const prefixIconNode = prefixIcon ? <Icon icon={prefixIcon} className={`mr-2 ${iconColor}`} /> : null
  const suffixIconNode = suffixIcon ? <Icon icon={suffixIcon} className={iconColor} /> : null

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  return (
    <div className={wrapperClassNames}>
      {prefixIconNode}
      <input
        value={value}
        className={inputClassNames}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onInputChange}
        placeholder={placeholder}
        {...attributes}
      />
      {suffixIconNode}
    </div>
  )
}

export default Input
