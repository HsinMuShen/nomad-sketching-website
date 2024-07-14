import { render, screen } from '@testing-library/react'
import LoadingState from '.'

jest.mock('@ui', () => ({
  Icon: jest.fn(({ icon }) => <div data-testid={icon} />),
}))

describe('<LoadingState />', () => {
  it('should render loading icon correctly', () => {
    render(<LoadingState />)

    const loadingIcon = screen.getByTestId('i-mdi-loading')
    expect(loadingIcon).toBeInTheDocument()
  })
})
