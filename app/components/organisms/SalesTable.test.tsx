// src/components/organisms/SalesTable/SalesTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SalesTable } from './SalesTable'

// Mock subcomponents
vi.mock('~/components/atoms/Badge', () => ({
    Badge: ({ children, variant }: any) => (
        <span data-testid={`badge-${variant}`} data-children={children}>
      {children}
    </span>
    )
}))

vi.mock('~/components/atoms/Spinner', () => ({
    Spinner: () => <div data-testid="spinner" />
}))

const mockSales = [
    {
        id: 1,
        fecha: '2025-11-30T10:30:00',
        total: 29225,
        metodoPago: 'Efectivo',
        estado: 'completada',
        cajero: 'Ana Gómez'
    },
    {
        id: 2,
        fecha: '2025-11-30T14:15:00',
        total: 89990,
        metodoPago: 'Tarjeta',
        estado: 'pendiente',
        cajero: 'Carlos López'
    }
]

describe('SalesTable', () => {
    const mockOnViewDetails = vi.fn()

    it('renders loading spinner when isLoading=true', () => {
        render(<SalesTable sales={[]} isLoading />)
        expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })

    it('renders empty state when no sales', () => {
        render(<SalesTable sales={[]} />)
        expect(screen.getByText('No hay ventas registradas')).toBeInTheDocument()
    })

    it('renders table with correct headers', () => {
        render(<SalesTable sales={mockSales} onViewDetails={mockOnViewDetails} />)

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('Fecha')).toBeInTheDocument()
        expect(screen.getByText('Cajero')).toBeInTheDocument()
        expect(screen.getByText('Método Pago')).toBeInTheDocument()
        expect(screen.getByText('Total')).toBeInTheDocument()
        expect(screen.getByText('Estado')).toBeInTheDocument()
        expect(screen.getByText('Acciones')).toBeInTheDocument()
    })

    it('renders sales data correctly', () => {
        render(<SalesTable sales={mockSales} onViewDetails={mockOnViewDetails} />)

        expect(screen.getByText('#1')).toBeInTheDocument()
        expect(screen.getByText('30/11/2025')).toBeInTheDocument()
        expect(screen.getByText('Ana Gómez')).toBeInTheDocument()
        expect(screen.getByText('Efectivo')).toBeInTheDocument()
        expect(screen.getByText('$29.225')).toBeInTheDocument()
        expect(screen.getByTestId('badge-success')).toHaveAttribute('data-children', 'completada')
    })

    it('shows dash when no cajero', () => {
        const salesSinCajero = [{ ...mockSales[0], cajero: undefined }]
        render(<SalesTable sales={salesSinCajero} onViewDetails={mockOnViewDetails} />)
        expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('calls onViewDetails when details button clicked', () => {
        render(<SalesTable sales={mockSales} onViewDetails={mockOnViewDetails} />)
        fireEvent.click(screen.getAllByText('Ver detalles')[0])
        expect(mockOnViewDetails).toHaveBeenCalledWith(1)
    })

    it('does NOT show actions column when onViewDetails not provided', () => {
        render(<SalesTable sales={mockSales} />)
        expect(screen.queryByText('Acciones')).not.toBeInTheDocument()
        expect(screen.queryByText('Ver detalles')).not.toBeInTheDocument()
    })

    it('applies responsive table classes', () => {
        const { container } = render(<SalesTable sales={mockSales} />)
        const tableContainer = container.querySelector('div')
        expect(tableContainer).toHaveClass('overflow-x-auto', 'bg-white', 'rounded-lg', 'shadow')
    })
})
