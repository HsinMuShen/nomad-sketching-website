import { render, screen } from '@testing-library/react'
import { Chip } from 'src/components/common/ui'

const CONTEXT = 'ChipComponent'
const MOCK_CLOSE_ICON = 'i-mdi-close-circle'

describe('Chip', () => {
  test('renders children', () => {
    render(<Chip>{CONTEXT}</Chip>)
    expect(screen.getByText(CONTEXT)).toBeInTheDocument()
  })

  test('renders avatar if avatarSrc is provided', () => {
    render(<Chip avatarSrc="avatar.png" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  test('renders close button if closable is true', () => {
    render(<Chip closable />)
    expect(screen.getByRole('img')).toHaveClass(MOCK_CLOSE_ICON)
  })
})
