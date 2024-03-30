import { render, screen } from '@testing-library/react'
import Button from '.'

describe('Button', () => {
  it('render successfully', () => {
    const onClick = () => console.log('onClick')
    render(<Button onClick={onClick} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
