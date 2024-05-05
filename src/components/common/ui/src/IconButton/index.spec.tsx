import { render, screen } from '@testing-library/react'
import { IconButton } from 'src/components/common/ui'

const MOCK_LOADING_ICON = 'i-mdi-loading'

describe('IconButton', () => {
  it('renders with the correct custom className', () => {
    render(<IconButton icon="i-mdi-paperclip" className="custom-class" />)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('renders with the specified color', () => {
    render(<IconButton icon="i-mdi-paperclip" color="primary" />)
    expect(screen.getByRole('button').className).toMatch(/primary/)
  })

  it('renders with the specified variant', () => {
    render(<IconButton icon="i-mdi-paperclip" variant="text" />)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('renders with the rounded prop is true', () => {
    render(<IconButton icon="i-mdi-paperclip" rounded />)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('renders with the disabled prop is true', () => {
    render(<IconButton icon="i-mdi-paperclip" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders with the isLoading prop is true', () => {
    render(<IconButton icon="i-mdi-paperclip" isLoading />)
    expect(screen.getByRole('img')).toHaveClass(MOCK_LOADING_ICON)
  })
})
