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

    // Check that it shows the correct text for light mode
    expect(button).toHaveTextContent('☀️ Light')
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
    expect(button).toHaveClass('px-4', 'py-2', 'w-full', 'justify-center')
  })
})
