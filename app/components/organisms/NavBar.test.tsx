// src/components/organisms/Navbar/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Navbar } from './NavBar'

// Mock react-router Link (versión antigua)
vi.mock('react-router', () => ({
    Link: ({ children, to, className }: any) => (
        <a href={to} className={className} data-testid="navbar-link">
            {children}
        </a>
    )
}))

// Mock subcomponents
vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props} data-testid="logout-button">
            {children}
        </button>
    )
}))

vi.mock('~/components/molecules/UserBadge', () => ({
    UserBadge: ({ nombre, rol }: any) => (
        <div data-testid="user-badge">
            {nombre} - {rol}
        </div>
    )
}))

describe('Navbar', () => {
    const defaultProps = {
        userName: 'Ana Gómez',
        userRole: 'cajero' as const,
        onLogout: vi.fn()
    }

    it('renders brand link correctly', () => {
        // @ts-ignore
        render(<Navbar {...defaultProps} />)
        const link = screen.getByTestId('navbar-link')
        expect(link).toHaveTextContent('🎮 Gamer Zeta')
        expect(link).toHaveClass('text-2xl', 'font-bold', 'text-blue-600')
        expect(link).toHaveAttribute('href', '/')
    })

    it('renders UserBadge with correct data', () => {
        // @ts-ignore
        render(<Navbar {...defaultProps} />)
        expect(screen.getByTestId('user-badge')).toHaveTextContent('Ana Gómez - cajero')
    })

    it('renders logout button', () => {
        // @ts-ignore
        render(<Navbar {...defaultProps} />)
        expect(screen.getByTestId('logout-button')).toHaveTextContent('Salir')
    })

    it('calls onLogout when logout button clicked', () => {
        // @ts-ignore
        render(<Navbar {...defaultProps} />)
        fireEvent.click(screen.getByTestId('logout-button'))
        expect(defaultProps.onLogout).toHaveBeenCalledTimes(1)
    })

    it('handles admin role', () => {
        render(<Navbar {...defaultProps} userRole="admin" />)
        expect(screen.getByTestId('user-badge')).toHaveTextContent('Ana Gómez - admin')
    })

    it('applies correct layout classes', () => {
        // @ts-ignore
        const { container } = render(<Navbar {...defaultProps} />)
        const nav = container.querySelector('nav')
        expect(nav).toHaveClass('bg-white', 'shadow-sm', 'border-b')
    })

    it('has responsive container', () => {
        // @ts-ignore
        const { container } = render(<Navbar {...defaultProps} />)
        const containerDiv = container.querySelector('div')
        expect(containerDiv).toHaveClass('max-w-7xl', 'mx-auto', 'px-4')
    })
})
