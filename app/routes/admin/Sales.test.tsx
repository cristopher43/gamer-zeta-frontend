// src/components/Sales/Sales.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Sales from './Sales'

// Mock ventasService
const mockVentasService = {
    getAll: vi.fn()
}

vi.mock('~/services/api/ventasService', () => ({
    ventasService: mockVentasService
}))

// Mock SalesTable
vi.mock('~/components/organisms/SalesTable', () => ({
    SalesTable: ({ sales }: any) => (
        <div data-testid="sales-table">
            {sales.length} ventas cargadas:
            {sales.map((sale: any) => (
                <div key={sale.id} data-testid={`sale-${sale.id}`}>
                    {sale.fecha} - ${sale.total}
                </div>
            ))}
        </div>
    )
}))

const mockSales = [
    {
        id: 1,
        fecha: '2025-11-30T10:30:00Z',
        total: 899990,
        metodoPago: 'tarjeta',
        estado: 'completada',
        usuario: { name: 'Ana Admin' }
    },
    {
        id: 2,
        fecha: '2025-11-30T14:15:00Z',
        total: 25000,
        metodoPago: 'efectivo',
        estado: 'completada',
        usuario: { name: 'Juan Pérez' }
    }
]

describe('Sales', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        Object.defineProperty(window, 'alert', { value: vi.fn() })
    })

    it('shows loading state initially', () => {
        mockVentasService.getAll.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        render(<Sales />)
        expect(screen.getByText('Cargando ventas...')).toBeInTheDocument()
    })

    it('renders sales table after loading', async () => {
        mockVentasService.getAll.mockResolvedValue(mockSales)

        render(<Sales />)

        await waitFor(() => {
            expect(screen.getByText('Historial de Ventas')).toBeInTheDocument()
            expect(screen.getByTestId('sales-table')).toBeInTheDocument()
            expect(screen.getByTestId('sale-1')).toBeInTheDocument()
            expect(screen.getByText('2 ventas cargadas:')).toBeInTheDocument()
        })
    })

    it('shows error state with retry button', async () => {
        mockVentasService.getAll.mockRejectedValue(new Error('API Error'))

        render(<Sales />)

        await waitFor(() => {
            expect(screen.getByText('Error al cargar el historial de ventas')).toBeInTheDocument()
            expect(screen.getByText('🔄 Reintentar')).toBeInTheDocument()
        })
    })

    it('retries loading on error button click', async () => {
        mockVentasService.getAll
            .mockRejectedValueOnce(new Error('First error'))
            .mockResolvedValueOnce(mockSales)

        render(<Sales />)

        await waitFor(() => screen.getByText('Error al cargar el historial de ventas'))

        fireEvent.click(screen.getByText('🔄 Reintentar'))

        await waitFor(() => {
            expect(mockVentasService.getAll).toHaveBeenCalledTimes(2)
            expect(screen.getByTestId('sales-table')).toBeInTheDocument()
        })
    })

    it('shows refresh button and reloads data', async () => {
        mockVentasService.getAll.mockResolvedValue(mockSales)

        render(<Sales />)

        await waitFor(() => screen.getByText('Historial de Ventas'))
        const refreshBtn = screen.getByText('🔄 Actualizar')

        expect(refreshBtn).toBeInTheDocument()
        expect(refreshBtn).toHaveClass('bg-blue-600', 'hover:bg-blue-700')

        fireEvent.click(refreshBtn)

        await waitFor(() => {
            expect(mockVentasService.getAll).toHaveBeenCalledTimes(2)
        })
    })

    it('shows empty state when no sales', async () => {
        mockVentasService.getAll.mockResolvedValue([])

        render(<Sales />)

        await waitFor(() => {
            expect(screen.getByText('Sin ventas')).toBeInTheDocument()
            expect(screen.getByText('No hay ventas registradas aún')).toBeInTheDocument()
            expect(screen.getByRole('img', { name: /📊/i })).toBeInTheDocument()
        })
    })

    it('applies correct styling to empty state', async () => {
        mockVentasService.getAll.mockResolvedValue([])

        render(<Sales />)

        await waitFor(() => screen.getByText('Sin ventas'))

        const emptyState = screen.getByText('Sin ventas').closest('div')
        expect(emptyState).toHaveClass(
            'bg-gradient-to-br',
            'from-gray-50',
            'to-blue-50',
            'rounded-3xl',
            'shadow-xl',
            'p-12',
            'border-4',
            'border-dashed'
        )
    })

    it('handles loading state with animate-pulse', () => {
        mockVentasService.getAll.mockImplementation(() => new Promise(() => {})) // Never resolves

        render(<Sales />)

        const loadingEl = screen.getByText('Cargando ventas...')
        expect(loadingEl).toHaveClass('animate-pulse')
        expect(loadingEl.closest('div')).toHaveClass('flex', 'justify-center', 'items-center', 'h-64')
    })
})
