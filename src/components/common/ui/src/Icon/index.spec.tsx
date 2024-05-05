import { render, screen } from '@testing-library/react'
import { Icon } from 'src/components/common/ui'

describe('Icon', () => {
  it('render successfully', () => {
    render(<Icon icon="i-mdi-paperclip" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
