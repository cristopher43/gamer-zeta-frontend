// src/layouts/AdminLayout/AdminLayout.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
// @ts-ignore
import AdminLayout from './AdminLayout'

// Mock React Router v6 hooks + components
const mockNavigate = vi.fn()
const mockUseLocation = vi.fn(() => ({ pathname: '/admin/dashboard' }))

vi.mock('react-router', () => ({
    Outlet: () => <div data-testid="outlet">Admin Content</div>,
    Link: ({ children, to, className }: any) => (
        <a href={to} className={className} data-testid={`nav-link-${to.replace(/\//g, '-')}`}>
            {children}
        </a>
    ),
    useLocation: mockUseLocation,
    useNavigate: () => mockNavigate
}))

// Mock AuthContext + subcomponents
vi.mock('~/context/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Ana Admin' },
        logout: vi.fn()
    })
}))

vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick} data-testid="logout-btn">{children}</button>
    )
}))

vi.mock('~/components/atoms/Badge', () => ({
    Badge: ({ children }: any) => <span data-testid="admin-badge">{children}</span>
}))

vi.mock('~/components/ProtectedRoute', () => ({
    ProtectedRoute: ({ children }: any) => <>{children}</>
}))

describe('AdminLayout', () => {
    it('renders navbar with brand and admin badge', () => {
        render(<AdminLayout />)
        expect(screen.getByText('🎮 Gamer Zeta')).toBeInTheDocument()
        expect(screen.getByTestId('admin-badge')).toHaveTextContent('ADMIN')
    })

    it('renders user info and logout button', () => {
        render(<AdminLayout />)
        expect(screen.getByText('Ana Admin')).toBeInTheDocument()
        expect(screen.getByText('Administrador')).toBeInTheDocument()
        expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    })

    it('renders sidebar navigation', () => {
        render(<AdminLayout />)
        expect(screen.getByText('📊')).toBeInTheDocument()
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('💰')).toBeInTheDocument()
        expect(screen.getByText('Ventas')).toBeInTheDocument()
    })

    it('highlights active sidebar item', () => {
        render(<AdminLayout />)
        const dashboardLink = screen.getByTestId('nav-link-admin-dashboard')
        expect(dashboardLink).toHaveClass('bg-blue-600', 'text-white')
    })

    it('calls logout and navigates to login on logout click', () => {
        const mockLogout = vi.fn()
        vi.mock('~/context/AuthContext', () => ({
            useAuth: () => ({
                user: { name: 'Ana Admin' },
                logout: mockLogout
            })
        }))

        render(<AdminLayout />)
        fireEvent.click(screen.getByTestId('logout-btn'))

        expect(mockLogout).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('renders main content outlet', () => {
        render(<AdminLayout />)
        expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })

    it('applies correct layout classes', () => {
        const { container } = render(<AdminLayout />)
        const main = container.querySelector('main')
        expect(main).toHaveClass('flex-1', 'ml-64', 'p-6')

        const sidebar = container.querySelector('aside')
        expect(sidebar).toHaveClass('w-64', 'bg-white', 'shadow-md')
    })

    it('renders ProtectedRoute wrapper', () => {
        render(<AdminLayout />)
        expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })
})
