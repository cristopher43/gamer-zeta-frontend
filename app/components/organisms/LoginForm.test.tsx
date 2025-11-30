// src/components/organisms/LoginForm/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from './LoginForm'

// Mock subcomponents
vi.mock('~/components/molecules/FormField', () => ({
    FormField: ({ label, id, value, onChange, ...props }: any) => (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                value={value}
                onChange={onChange}
                aria-required="true"
                {...props}
            />
        </div>
    )
}))

vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, isLoading, ...props }: any) => (
        <button {...props} data-loading={isLoading}>
            {isLoading ? 'Cargando...' : children}
        </button>
    )
}))

vi.mock('~/components/molecules/AlertMessage', () => ({
    AlertMessage: ({ message }: any) => (
        <div data-testid="error-alert" role="alert">{message}</div>
    )
}))

describe('LoginForm', () => {
    const mockSubmit = vi.fn()
    const user = userEvent.setup()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders form title', () => {
        render(<LoginForm onSubmit={mockSubmit} />)
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    })

    it('renders email and password fields', () => {
        render(<LoginForm onSubmit={mockSubmit} />)
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    })

    it('updates state on input change', async () => {
        render(<LoginForm onSubmit={mockSubmit} />)

        await user.type(screen.getByLabelText(/email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/contraseña/i), 'password123')

        expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com')
        expect(screen.getByLabelText(/contraseña/i)).toHaveValue('password123')
    })

    it('shows loading state on submit', async () => {
        render(<LoginForm onSubmit={mockSubmit} />)

        await user.click(screen.getByText('Ingresar'))

        expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })

    it('calls onSubmit with correct values on successful submit', async () => {
        render(<LoginForm onSubmit={mockSubmit} />)

        await user.type(screen.getByLabelText(/email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/contraseña/i), 'password123')
        await user.click(screen.getByText('Ingresar'))

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith('test@example.com', 'password123')
        })
    })

    it('shows error message on failed submit', async () => {
        mockSubmit.mockRejectedValueOnce({ response: { data: { message: 'Credenciales inválidas' } } })

        render(<LoginForm onSubmit={mockSubmit} />)

        await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
        await user.click(screen.getByText('Ingresar'))

        await waitFor(() => {
            expect(screen.getByTestId('error-alert')).toBeInTheDocument()
            expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
        })
    })

    it('hides error on successful submit', async () => {
        render(<LoginForm onSubmit={mockSubmit} />)

        // Show error first
        mockSubmit.mockRejectedValueOnce({ response: { data: { message: 'Error' } } })
        await user.click(screen.getByText('Ingresar'))

        // Clear error with successful submit
        // @ts-ignore
        mockSubmit.mockResolvedValueOnce()
        await user.type(screen.getByLabelText(/email/i), 'test@example.com')
        await user.click(screen.getByText('Ingresar'))

        await waitFor(() => {
            expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument()
        })
    })

    it('form fields are required and accessible', () => {
        render(<LoginForm onSubmit={mockSubmit} />)

        const emailField = screen.getByLabelText(/email/i)
        const passwordField = screen.getByLabelText(/contraseña/i)

        expect(emailField).toBeRequired()
        expect(passwordField).toBeRequired()
    })
})
