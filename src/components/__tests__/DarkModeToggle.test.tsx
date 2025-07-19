import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import DarkModeToggle from '../DarkModeToggle'

// Mock the ThemeContext since we're testing the component in isolation
const mockToggleTheme = jest.fn()
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
}))

describe('DarkModeToggle', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    mockToggleTheme.mockClear()
  })

  it('renders the toggle button with correct initial state', () => {
    render(<DarkModeToggle />)

    // Check that the button exists
    const button = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(button).toBeInTheDocument()

    // Check that it shows the moon icon for light mode (to switch to dark)
    const moonIcon = button.querySelector('svg')
    expect(moonIcon).toBeInTheDocument()
  })

  it('calls toggleTheme when clicked', async () => {
    const user = userEvent.setup()
    render(<DarkModeToggle />)

    const button = screen.getByRole('button', { name: /switch to dark mode/i })
    await user.click(button)

    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('applies mobile styles when mobile prop is true', () => {
    render(<DarkModeToggle mobile={true} />)

    const button = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(button).toHaveClass('w-12', 'h-12')

    // Check that the icon is larger in mobile mode
    const icon = button.querySelector('svg')
    expect(icon).toHaveClass('w-5', 'h-5')
  })
})
