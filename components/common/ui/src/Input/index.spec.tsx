import { render, screen } from '@testing-library/react'
import { Input } from '@ui'

describe('Input', () => {
  it('render successfully', () => {
    const value = ''
    const onChange = () => console.log('onChange')
    render(<Input value={value} onChange={onChange} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
