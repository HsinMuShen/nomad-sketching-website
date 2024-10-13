import type { Size } from './constants'
import type { MouseEvent } from 'react'
import { IconButton } from '@ui'
import { SIZE_CONFIG, MOBILE_FULL_SCREEN, MOBILE_PARTIAL_SCREEN, BACKDROP_BLUR, NO_WRAP } from './constants'

export type DialogProps = {
  onClose?: () => void
  title?: string
  className?: string
  hideCloseIcon?: boolean
  children?: JSX.Element
  footer?: JSX.Element
  size?: Size
  isMobileFullScreen?: boolean
  isBackdropBlur?: boolean
  isTitleWrap?: boolean
}

export function Dialog({
  onClose,
  title = '',
  className = '',
  hideCloseIcon = false,
  children,
  footer,
  size = 'sm',
  isMobileFullScreen = true,
  isBackdropBlur = true,
  isTitleWrap = false,
}: DialogProps) {
  const mobileClass = isMobileFullScreen ? MOBILE_FULL_SCREEN : MOBILE_PARTIAL_SCREEN
  const dialogClassNames = [SIZE_CONFIG[size], mobileClass, className].join(' ')
  const backdropClassNames = isBackdropBlur ? BACKDROP_BLUR : ''
  const titleClassNames = isTitleWrap ? '' : NO_WRAP
  const onDialogClick = (event: MouseEvent) => event.stopPropagation()

  return (
    <div className="fixed left-0 top-0 z-2">
      <div
        role="presentation"
        className={`h-screen w-screen bg-gray-4 bg-opacity-30 ${backdropClassNames}`}
        onClick={onClose}
      />
      <dialog
        open
        className={`flex flex-col p-4 sm:p-5 absolute top-1/2 translate-y--1/2 z-3 border-none sm:rounded-xl shadow-dialog ${dialogClassNames}`}
        onClick={onDialogClick}
      >
        {!hideCloseIcon && (
          <div data-testid="dialog-close-icon" className="absolute right-4 top-3.5 sm:right-5 sm:top-4.5">
            <IconButton
              icon="i-mdi-close"
              size="2xl"
              color="functional-dark"
              variant="text"
              hasPadding={false}
              onClick={onClose}
            />
          </div>
        )}
        {title && (
          <h2
            className={`m-0 mr-9 flex overflow-hidden pb-2 text-base font-bold text-neutral-700 sm:pb-3 sm:text-lg ${titleClassNames}`}
          >
            {title}
          </h2>
        )}
        {children && <div className="my-4 flex-1 overflow-y-scroll text-neutral-700 sm:my-5">{children}</div>}
        {footer && <div className="mt-2 h-9 flex items-center sm:mt-3">{footer}</div>}
      </dialog>
    </div>
  )
}

export default Dialog
