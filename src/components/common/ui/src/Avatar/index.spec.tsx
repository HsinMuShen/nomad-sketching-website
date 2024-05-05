import { render, screen } from '@testing-library/react'
import { Avatar, DEFAULT_AVATAR } from 'src/components/common/ui'

describe('Avatar', () => {
  it('render successfully', () => {
    render(<Avatar src="https://i.pravatar.cc/300" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('render no-avatar image when src is empty', () => {
    render(<Avatar src="" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', DEFAULT_AVATAR)
  })
})
