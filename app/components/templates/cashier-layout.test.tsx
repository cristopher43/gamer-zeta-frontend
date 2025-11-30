// src/layouts/CashierLayout/CashierLayout.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CashierLayout from './cashier-layout'

// Mock React Router v6
const mockNavigate = vi.fn()
const mockUseLocation = vi.fn(() => ({ pathname: '/cashier' }))

vi.mock('react-router', () => ({
    Outlet: () => <div data-testid="outlet">Cashier Content</div>,
    Link: ({ children, to, className }: any) => (
        <a href={to} className={className} data-testid={`nav-link-${to.replace(/\//g, '-')}`} data-to={to}>
    {children}
    </a>
),
useLocation: mockUseLocation,
    useNavigate: () => mockNavigate
}))

// Mock AuthContext + ProtectedRoute
vi.mock('~/context/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Juan Pérez' },
        logout: vi.fn()
    })
}))

vi.mock('~/components/ProtectedRoute', () => ({
    ProtectedRoute: ({ children }: any) => <>{children}</>
}))

vi.mock('~/components/atoms/Button', () => ({
        Button: ({ children, onClick }: any) => (
            <button onClick={onClick} data-testid="logout-btn">{children}</button>
)
}))

describe('CashierLayout', () => {
    it('renders brand link', () => {
        render(<CashierLayout />)
        expect(screen.getByText('🎮 Gamer Zeta')).toBeInTheDocument()
    })

    it('renders cashier navigation link', () => {
        render(<CashierLayout />)
        expect(screen.getByText('Punto de Venta')).toBeInTheDocument()
    })

    it('renders user info and logout button', () => {
        render(<CashierLayout />)
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        expect(screen.getByText('Cajero')).toBeInTheDocument()
        expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    })

    it('highlights active nav link when on /cashier', () => {
        render(<CashierLayout />)
        const puntoVentaLink = screen.getByTestId('nav-link-cashier')
        expect(puntoVentaLink).toHaveClass('bg-blue-100', 'text-blue-700')
    })

    it('applies inactive state for other paths', () => {
        mockUseLocation.mockReturnValue({ pathname: '/cashier/sales' })
        render(<CashierLayout />)
        const puntoVentaLink = screen.getByTestId('nav-link-cashier')
        expect(puntoVentaLink).toHaveClass('text-gray-700')
        expect(puntoVentaLink).not.toHaveClass('bg-blue-100', 'text-blue-700')
    })

    it('calls logout and navigates to login', () => {
        const mockLogout = vi.fn()
        vi.mock('~/context/AuthContext', () => ({
            useAuth: () => ({
                user: { name: 'Juan Pérez' },
                logout: mockLogout
            })
        }))

        render(<CashierLayout />)
        fireEvent.click(screen.getByTestId('logout-btn'))

        expect(mockLogout).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('renders main content outlet', () => {
        render(<CashierLayout />)
        expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })

    it('applies responsive container classes', () => {
        const { container } = render(<CashierLayout />)
        const main = container.querySelector('main')
        expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'py-6')
    })
})
