type Size = 'sm' | 'md' | 'lg'

export type AvatarProps = {
  src: string
  className?: string
  username?: string
  online?: boolean
  size?: Size
}

type SizeConfig = {
  [key in Size]: string
}

const AVATAR_SIZE: SizeConfig = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
}

const INDICATOR_SIZE: SizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

const DEFAULT_SIZE: Size = 'md'
const AVATAR_CLASS_NAMES =
  'w-full h-full object-cover overflow-hidden rounded-full d-block absolute top-0 left-0'
const INDICATOR_CLASS_NAMES =
  'rounded-full bg-secondary-500 border-1 border-white border-solid absolute bottom-0 right-0'
const INDICATOR_LABEL = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
}
export const DEFAULT_AVATAR =
  'https://res.cloudinary.com/amazingtalker/image/upload/icon/no-avatar.png'

export function Avatar({
  src,
  className = '',
  username,
  online,
  size,
  ...attributes
}: AvatarProps) {
  const indicatorLabel = online
    ? INDICATOR_LABEL.ONLINE
    : INDICATOR_LABEL.OFFLINE
  const currentSize = size || DEFAULT_SIZE
  const classNames = [className, AVATAR_SIZE[currentSize], 'relative'].join(' ')
  const avatarSrc = src || DEFAULT_AVATAR

  return (
    <div className={classNames} {...attributes}>
      <img src={avatarSrc} className={AVATAR_CLASS_NAMES} alt={username} />
      <span
        className={`${INDICATOR_SIZE[currentSize]} ${INDICATOR_CLASS_NAMES}`}
        hidden={!online}
        role="status"
        aria-live="polite"
        aria-label={indicatorLabel}
      />
    </div>
  )
}

export default Avatar
