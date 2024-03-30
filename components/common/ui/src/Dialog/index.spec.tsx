import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog } from '@ui'
import {
  Size,
  MOBILE_FULL_SCREEN,
  MOBILE_PARTIAL_SCREEN,
  BACKDROP_BLUR,
  NO_WRAP,
} from './constants'

const TITLE = 'title'
const CHILDREN = 'content'
const FOOTER = <p>footer</p>
const SIZE_MD_REGEX = /w-2xl/
const onClose = jest.fn()

const setup = ({
  size = 'sm',
  title = '',
  hideCloseIcon = false,
  isMobileFullScreen = true,
  isBackdropBlur = true,
  isTitleWrap = false,
}: {
  title?: string
  hideCloseIcon?: boolean
  size?: Size
  isMobileFullScreen?: boolean
  isBackdropBlur?: boolean
  isTitleWrap?: boolean
} = {}) => {
  render(
    <Dialog
      onClose={onClose}
      size={size}
      title={title}
      hideCloseIcon={hideCloseIcon}
      footer={FOOTER}
      isMobileFullScreen={isMobileFullScreen}
      isBackdropBlur={isBackdropBlur}
      isTitleWrap={isTitleWrap}
    >
      <div>{CHILDREN}</div>
    </Dialog>,
  )
}

describe('rendering', () => {
  test('render dialog backdrop', () => {
    setup()
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  test('render dialog', async () => {
    setup()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('render title', async () => {
    setup({ title: TITLE })
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  test('not render title', () => {
    setup()
    expect(() => screen.getByRole('heading')).toThrow()
  })

  test('render children', () => {
    setup()
    expect(screen.getByText(CHILDREN)).toBeInTheDocument()
  })
  test('render footer', () => {
    setup()
    expect(screen.getByText('footer')).toBeInTheDocument()
  })

  test('render close icon', () => {
    setup()
    expect(screen.getByTestId('dialog-close-icon')).toBeInTheDocument()
  })
  test('not render close icon', () => {
    setup({ hideCloseIcon: true })
    expect(() => screen.getByTestId('dialog-close-icon')).toThrow()
  })

  test('renders with the specified color', () => {
    setup({ size: 'md' })
    expect(screen.getByRole('dialog').className).toMatch(SIZE_MD_REGEX)
  })

  describe('render correctly in mobile size', () => {
    test('with default props', () => {
      setup()
      expect(screen.getByRole('dialog').className).toMatch(MOBILE_FULL_SCREEN)
    })
    test('with isMobileFullScreen set to false', () => {
      setup({ isMobileFullScreen: false })
      expect(screen.getByRole('dialog').className).toMatch(
        MOBILE_PARTIAL_SCREEN,
      )
    })
  })

  describe('render backdrop correctly', () => {
    test('with default props', () => {
      setup()
      expect(screen.getByRole('presentation').className).toMatch(BACKDROP_BLUR)
    })
    test('with isBackdropBlur set to false', () => {
      setup({ isBackdropBlur: false })
      expect(screen.getByRole('presentation').className).not.toMatch(
        BACKDROP_BLUR,
      )
    })
  })

  describe('render title correctly', () => {
    test('with default props', () => {
      setup({ title: TITLE })
      expect(screen.getByText(TITLE).className).toMatch(NO_WRAP)
    })
    test('with isTitleWrap set to true', () => {
      setup({ title: TITLE, isTitleWrap: true })
      expect(screen.getByText(TITLE).className).not.toMatch(NO_WRAP)
    })
  })
})

describe('interaction', () => {
  beforeEach(() => {
    setup()
    onClose.mockReset()
  })

  test('trigger onClose when click backdrop', async () => {
    await fireEvent.click(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalled()
  })

  test('not trigger onClose when click dialog', async () => {
    await fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })
})
