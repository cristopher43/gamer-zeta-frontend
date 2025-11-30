// src/components/molecules/UserBadge/UserBadge.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UserBadge } from './UserBadge'

// Mock Badge
vi.mock('~/components/atoms/Badge', () => ({
        Badge: ({ children, variant }: any) => (
            <span data-testid={`badge-${variant}`}>{children}</span>
)
}))

describe('UserBadge', () => {
    it('renders admin user correctly', () => {
        render(<UserBadge nombre="Ana Gómez" rol="admin" />)
        expect(screen.getByText('A')).toBeInTheDocument()
        expect(screen.getByText('Ana Gómez')).toBeInTheDocument()
        expect(screen.getByTestId('badge-success')).toHaveTextContent('Administrador')
    })

    it('renders cashier user correctly', () => {
        render(<UserBadge nombre="Juan Pérez" rol="cashier" />)
        expect(screen.getByText('J')).toBeInTheDocument()
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        expect(screen.getByTestId('badge-info')).toHaveTextContent('Cajero')
    })

    it('generates correct avatar initial', () => {
        render(<UserBadge nombre="Carlos López" rol="admin" />)
        expect(screen.getByText('C')).toBeInTheDocument()

        // @ts-ignore
        render(<UserBadge nombre="María Silva" rol="cajero" />)
        expect(screen.getByText('M')).toBeInTheDocument()
    })

    it('applies avatar styling classes', () => {
        const { container } = render(<UserBadge nombre="Ana Admin" rol="admin" />)
        const avatar = container.querySelector('div')
        expect(avatar).toHaveClass('w-10', 'h-10', 'bg-blue-600', 'rounded-full', 'flex', 'items-center', 'justify-center', 'text-white', 'font-bold')
    })

    it('handles single character names', () => {
        render(<UserBadge nombre="A" rol="admin" />)
        expect(screen.getByText('A')).toBeInTheDocument()
    })

    it('handles empty names gracefully', () => {
        // @ts-ignore
        render(<UserBadge nombre="" rol="cashier" />)
        expect(screen.queryByText('A')).not.toBeInTheDocument()
    })

    it('applies correct flex layout', () => {
        const { container } = render(<UserBadge nombre="Test User" rol="admin" />)
        const badgeContainer = container.firstChild
        expect(badgeContainer).toHaveClass('flex', 'items-center', 'gap-3')
    })
})
