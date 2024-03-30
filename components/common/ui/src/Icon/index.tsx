export const SIZES = ['base', 'xl', '2xl', '3xl'] as const

export type Size = (typeof SIZES)[number]

export type IconProps = {
  icon: string
  size?: Size
  className?: string
}

const SIZE_CONFIG: Record<Size, string> = {
  base: 'text-4',
  xl: 'text-5',
  '2xl': 'text-6',
  '3xl': 'text-7',
}

export function Icon({ icon, size = 'base', className = '' }: IconProps) {
  const fontSize = SIZE_CONFIG[size]
  return (
    <span
      role="img"
      aria-label="icon-label"
      className={`inline-block vertical-middle leading-6 ${fontSize} ${icon} ${className}`}
    />
  )
}

export default Icon
