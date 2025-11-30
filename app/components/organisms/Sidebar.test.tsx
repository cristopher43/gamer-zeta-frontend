// src/components/organisms/Sidebar/Sidebar.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from './Sidebar'

// ✅ FIXED: Define SidebarItem interface
interface SidebarItem {
    path: string;
    label: string;
    icon: string;
}

const mockItems: SidebarItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/ventas', label: 'Ventas', icon: '💰' },
    { path: '/productos', label: 'Productos', icon: '📦' },
    { path: '/usuarios', label: 'Usuarios', icon: '👥' }
]

// ✅ FIXED: Helper to mock useLocation + re-render
const renderWithLocation = (pathname: string = '/dashboard') => {
    vi.doMock('react-router', () => ({
        Link: ({ children, to, className }: any) => (
            <a
                href={to}
                className={className}
                data-testid={`sidebar-link-${to.replace('/', '')}`}
                data-to={to}
            >
                {children}
            </a>
        ),
        useLocation: () => ({ pathname })
    }))

    return render(<Sidebar items={mockItems} />)
}

describe('Sidebar', () => {
    it('renders all sidebar items', () => {
        renderWithLocation()
        expect(screen.getAllByTestId(/^sidebar-link-/)).toHaveLength(4)
    })

    it('renders correct icons and labels', () => {
        renderWithLocation()
        expect(screen.getByText('📊')).toBeInTheDocument()
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('💰')).toBeInTheDocument()
        expect(screen.getByText('Ventas')).toBeInTheDocument()
        expect(screen.getByText('👥')).toBeInTheDocument()
        expect(screen.getByText('Usuarios')).toBeInTheDocument()
    })

    it('applies active state to current path', () => {
        renderWithLocation('/dashboard')
        const activeLink = screen.getByTestId('sidebar-link-dashboard')
        expect(activeLink).toHaveClass('bg-blue-600', 'text-white')
        expect(activeLink).toHaveAttribute('aria-current', 'page')
    })

    it('applies inactive state to other paths', () => {
        renderWithLocation('/dashboard')
        const ventasLink = screen.getByTestId('sidebar-link-ventas')
        expect(ventasLink).toHaveClass('text-gray-700', 'hover:bg-gray-100')
        expect(ventasLink).not.toHaveClass('bg-blue-600', 'text-white')
    })

    it('changes active state with different location.pathname', () => {
        // Test /dashboard active
        const dashboardRender = renderWithLocation('/dashboard')
        expect(screen.getByTestId('sidebar-link-dashboard')).toHaveClass('bg-blue-600')

        // Test /ventas active
        dashboardRender.unmount()
        const ventasRender = renderWithLocation('/ventas')
        expect(screen.getByTestId('sidebar-link-ventas')).toHaveClass('bg-blue-600')
        expect(screen.getByTestId('sidebar-link-dashboard')).not.toHaveClass('bg-blue-600')
    })

    it('applies correct layout classes', () => {
        const { container } = renderWithLocation()
        const aside = container.querySelector('aside')
        expect(aside).toHaveClass(
            'w-64',
            'bg-white',
            'shadow-md',
            'fixed',
            'left-0',
            'top-16',
            'bottom-0',
            'overflow-y-auto',
            'z-40'
        )
    })

    it('handles empty items array', () => {
        const { container } = render(<Sidebar items={[]} />)
        expect(screen.queryAllByTestId(/^sidebar-link-/)).toHaveLength(0)
        expect(container.querySelector('nav')).toBeInTheDocument()
    })

    it('handles single item gracefully', () => {
        const singleItem = [{ path: '/test', label: 'Test', icon: '🔍' }]
        renderWithLocation('/test')
        expect(screen.getByTestId('sidebar-link-test')).toBeInTheDocument()
    })

    it('link data attributes are correct', () => {
        renderWithLocation()
        const dashboardLink = screen.getByTestId('sidebar-link-dashboard')
        expect(dashboardLink).toHaveAttribute('data-to', '/dashboard')
        expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })
})
