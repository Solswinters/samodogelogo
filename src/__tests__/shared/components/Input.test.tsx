import { render, screen, fireEvent } from '@/shared/test-utils/render'
import { Input } from '@/shared/components/Input'

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const onChange = jest.fn()
    render(<Input onChange={onChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(onChange).toHaveBeenCalled()
  })

  it('displays error message', () => {
    render(<Input error="Invalid input" />)
    expect(screen.getByText('Invalid input')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
