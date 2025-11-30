// src/components/molecules/StatCard/StatCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatCard } from './StatCard'

// Mock Text + Icon
vi.mock('~/components/atoms/Text', () => ({
    Text: ({ children, variant, className }: any) => (
        <span data-testid={`text-${variant}`} className={className}>
    {children}
    </span>
)
}))

vi.mock('~/components/atoms/Icon', () => ({
        Icon: ({ name, size }: any) => (
            <span data-testid="stat-icon" data-name={name} data-size={size}>
            {name}
            </span>
)
}))

describe('StatCard', () => {
    it('renders label and value correctly', () => {
        render(<StatCard icon="📊" label="Total Ventas" value={1250} />)
        expect(screen.getByTestId('text-small')).toHaveTextContent('Total Ventas')
        expect(screen.getByTestId('text-h2')).toHaveTextContent('1250')
    })

    it('renders icon with correct size and default variant', () => {
        render(<StatCard icon="💰" label="Ingresos" value="$89.990" />)
        const icon = screen.getByTestId('stat-icon')
        expect(icon).toHaveAttribute('data-name', '💰')
        expect(icon).toHaveAttribute('data-size', 'lg')
        expect(icon.closest('div')).toHaveClass('bg-blue-50', 'text-blue-600')
    })

    it('applies blue variant classes (default)', () => {
        render(<StatCard icon="👥" label="Clientes" value={342} variant="blue" />)
        const iconContainer = screen.getByTestId('stat-icon').closest('div')
        expect(iconContainer).toHaveClass('bg-blue-50', 'text-blue-600', 'p-4', 'rounded-full')
    })

    it('applies green variant classes', () => {
        render(<StatCard icon="✅" label="Ventas Hoy" value={45} variant="green" />)
        const iconContainer = screen.getByTestId('stat-icon').closest('div')
        expect(iconContainer).toHaveClass('bg-green-50', 'text-green-600')
    })

    it('applies yellow variant classes', () => {
        render(<StatCard icon="⚠️" label="Bajo Stock" value={12} variant="yellow" />)
        const iconContainer = screen.getByTestId('stat-icon').closest('div')
        expect(iconContainer).toHaveClass('bg-yellow-50', 'text-yellow-600')
    })

    it('applies purple variant classes', () => {
        render(<StatCard icon="⭐" label="Calificación" value="4.8" variant="purple" />)
        const iconContainer = screen.getByTestId('stat-icon').closest('div')
        expect(iconContainer).toHaveClass('bg-purple-50', 'text-purple-600')
    })

    it('handles numeric and string values', () => {
        render(<StatCard icon="📈" label="Crecimiento" value={25.5} />)
        expect(screen.getByTestId('text-h2')).toHaveTextContent('25.5')

        render(<StatCard icon="💯" label="Meta" value="100%" />)
        expect(screen.getByTestId('text-h2')).toHaveTextContent('100%')
    })

    it('applies card layout classes', () => {
        const { container } = render(<StatCard icon="🔥" label="Activos" value={89} />)
        const card = container.firstChild
        expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6', 'border')
    })
})
