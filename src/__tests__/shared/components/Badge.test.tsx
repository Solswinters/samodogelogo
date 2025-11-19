import { render, screen } from '@/shared/test-utils/render'
import { Badge } from '@/shared/components/Badge'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders different variants', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toBeInTheDocument()

    rerender(<Badge variant="error">Error</Badge>)
    expect(screen.getByText('Error')).toBeInTheDocument()

    rerender(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('renders different sizes', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toBeInTheDocument()

    render(<Badge size="lg">Large</Badge>)
    expect(screen.getByText('Large')).toBeInTheDocument()
  })
})
