import { render, screen } from '@/shared/test-utils/render'
import { Progress } from '@/shared/components/Progress'

describe('Progress', () => {
  it('renders with value', () => {
    render(<Progress value={50} max={100} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })

  it('displays percentage', () => {
    render(<Progress value={75} max={100} showLabel />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('handles custom colors', () => {
    render(<Progress value={50} color="success" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('clamps value to max', () => {
    render(<Progress value={150} max={100} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })
})
