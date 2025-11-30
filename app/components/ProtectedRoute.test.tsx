// src/components/ProtectedRoute/ProtectedRoute.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'

// Mock AuthContext
const mockUseAuth = vi.fn()
vi.mock('../context/AuthContext', () => ({
    useAuth: mockUseAuth
}))

// Mock Navigate (react-router v6)
vi.mock('react-router', () => ({
    Navigate: ({ to }: any) => <div data-testid={`navigate-${to}`}>Redirecting...</div>
}))

// Test child component
const TestChild = () => <div data-testid="protected-content">Protected Content</div>

describe('ProtectedRoute', () => {
    const defaultAuthState = {
        isAuthenticated: true,
        isAdmin: true,
        loading: false
    }

    it('shows loading spinner when loading=true', () => {
        mockUseAuth.mockReturnValue({ ...defaultAuthState, loading: true })

        render(
            <MemoryRouter>
                <ProtectedRoute requireAdmin={false}>
                    <TestChild />
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByRole('status')).toBeInTheDocument() // spinner
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('renders children when authenticated', () => {
        mockUseAuth.mockReturnValue(defaultAuthState)

        render(
            <MemoryRouter>
                <ProtectedRoute requireAdmin={false}>
                    <TestChild />
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('redirects to login when not authenticated', () => {
        mockUseAuth.mockReturnValue({ ...defaultAuthState, isAuthenticated: false })

        render(
            <MemoryRouter>
                <ProtectedRoute requireAdmin={false}>
                    <TestChild />
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByTestId('navigate-/login')).toBeInTheDocument()
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('redirects to /cashier when requireAdmin but not admin', () => {
        mockUseAuth.mockReturnValue({ ...defaultAuthState, isAdmin: false })

        render(
            <MemoryRouter>
                <ProtectedRoute requireAdmin={true}>
                    <TestChild />
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByTestId('navigate-/cashier')).toBeInTheDocument()
    })

    it('allows admin access to admin-only route', () => {
        mockUseAuth.mockReturnValue(defaultAuthState)

        render(
            <MemoryRouter>
                <ProtectedRoute requireAdmin={true}>
                    <TestChild />
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('applies loading spinner classes', () => {
        mockUseAuth.mockReturnValue({ ...defaultAuthState, loading: true })

        const { container } = render(
            <MemoryRouter>
                <ProtectedRoute requireAdmin={false}>
                    <TestChild />
                </ProtectedRoute>
            </MemoryRouter>
        )

        const spinnerContainer = container.querySelector('div')
        expect(spinnerContainer).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen')
    })
})
