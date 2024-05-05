import { render, screen } from '@testing-library/react'
import { Input } from 'src/components/common/ui'

describe('Input', () => {
  it('render successfully', () => {
    const value = ''
    const onChange = () => console.log('onChange')
    render(<Input value={value} onChange={onChange} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
