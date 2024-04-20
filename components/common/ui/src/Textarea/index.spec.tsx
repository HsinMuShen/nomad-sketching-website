import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextArea, TextAreaProps } from '@ui'

const onValueChange = jest.fn()

const setup = (props: Partial<TextAreaProps> = {}) => {
  const defaultProps: TextAreaProps = {
    onValueChange,
    placeholder: 'placeholder',
  }

  const mergedProps = { ...defaultProps, ...props }

  render(<TextArea {...mergedProps} />)
}

describe('rendering', () => {
  it('renders textarea', () => {
    setup()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders placeholder', () => {
    setup()
    expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument()
  })

  it('renders errorMessage', () => {
    setup({ errorMessage: 'errorMessage' })
    expect(screen.getByText('errorMessage')).toBeInTheDocument()
  })

  describe('counter', () => {
    const mockValue = 'Lorem ipsum'
    const minLength = 20
    const maxLength = 100

    it('renders when has minLength value', () => {
      setup({ value: mockValue, minLength })
      expect(screen.getByText(`${mockValue.length}/${minLength}`)).toBeInTheDocument()
    })

    it('renders when has maxLength value', () => {
      setup({ value: mockValue, maxLength })
      expect(screen.getByText(`${mockValue.length}/${maxLength}`)).toBeInTheDocument()
    })

    it('not renders when has no minLength or maxLength value', () => {
      setup()
      expect(screen.queryByText(`${mockValue.length}`)).not.toBeInTheDocument()
    })
  })
})

describe('interaction', () => {
  const inputValue = 'test'

  it('trigger onValueChange when typing', async () => {
    setup()
    await userEvent.type(screen.getByRole('textbox'), inputValue)
    expect(onValueChange).toHaveBeenCalledWith(inputValue)
  })
})
