// src/components/organisms/DashboardStats/DashboardStats.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DashboardStats } from './DashboardStats'

// Mock StatCard
vi.mock('~/components/molecules/StatCard', () => ({
    StatCard: ({ icon, label, value, variant }: any) => (
        <div data-testid={`stat-card-${label}`} data-variant={variant}>
            <span>{icon}</span>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    )
}))

describe('DashboardStats', () => {
    const defaultProps = {
        totalVentas: 156,
        ventasHoy: 23,
        productosVendidos: 89,
        ingresoTotal: '$2.450.000'
    }

    it('renders 4 StatCards', () => {
        render(<DashboardStats {...defaultProps} />)
        expect(screen.getAllByTestId(/^stat-card-/)).toHaveLength(4)
    })

    it('renders correct StatCards with data', () => {
        render(<DashboardStats {...defaultProps} />)

        expect(screen.getByTestId('stat-card-Ingreso Total')).toBeInTheDocument()
        expect(screen.getByTestId('stat-card-Total Ventas')).toBeInTheDocument()
        expect(screen.getByTestId('stat-card-Ventas Hoy')).toBeInTheDocument()
        expect(screen.getByTestId('stat-card-Productos Vendidos')).toBeInTheDocument()
    })

    it('passes correct props to StatCards', () => {
        render(<DashboardStats {...defaultProps} />)

        expect(screen.getByTestId('stat-card-Ingreso Total')).toHaveAttribute('data-variant', 'green')
        expect(screen.getByTestId('stat-card-Total Ventas')).toHaveAttribute('data-variant', 'blue')
        expect(screen.getByTestId('stat-card-Ventas Hoy')).toHaveAttribute('data-variant', 'yellow')
        expect(screen.getByTestId('stat-card-Productos Vendidos')).toHaveAttribute('data-variant', 'purple')
    })

    it('displays correct icons', () => {
        render(<DashboardStats {...defaultProps} />)
        expect(screen.getByText('💰')).toBeInTheDocument()
        expect(screen.getByText('📊')).toBeInTheDocument()
        expect(screen.getByText('🔥')).toBeInTheDocument()
        expect(screen.getByText('📦')).toBeInTheDocument()
    })

    it('applies responsive grid classes', () => {
        const { container } = render(<DashboardStats {...defaultProps} />)
        const grid = container.firstChild
        expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')
    })

    it('handles zero values', () => {
        render(<DashboardStats
            totalVentas={0}
            ventasHoy={0}
            productosVendidos={0}
            ingresoTotal="$0"
        />)
        expect(screen.getByTestId('stat-card-Total Ventas')).toBeInTheDocument()
    })
})
