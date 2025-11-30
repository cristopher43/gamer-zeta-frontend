// src/routes/admin/Dashboard.test.tsx
import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router'
import Dashboard from './Dashboard'

// Mock services
const mockDashboardService = {
    getStats: vi.fn()
}

const mockVentasService = {
    getAll: vi.fn()
}

vi.mock('~/services/api', () => ({
    dashboardService: mockDashboardService,
    ventasService: mockVentasService
}))

// Mock components
vi.mock('~/components/organisms/DashboardStats', () => ({
    DashboardStats: ({ totalVentas, ventasHoy, productosVendidos, ingresoTotal }: any) => (
        <div data-testid="dashboard-stats">
            Total: {totalVentas} | Hoy: {ventasHoy} | Productos: {productosVendidos} | Ingreso: {ingresoTotal}
        </div>
    )
}))

vi.mock('~/components/organisms/SalesTable', () => ({
    SalesTable: ({ sales }: any) => (
        <div data-testid="sales-table">
            {sales.map((sale: any) => (
                <div key={sale.id} data-testid={`sale-${sale.id}`}>
                    <span>{sale.fecha}</span>
                    <span>${sale.total}</span>
                    <span>{sale.metodoPago}</span>
                    <span>{sale.estado}</span>
                    <span>{sale.cajero}</span>
                </div>
            ))}
        </div>
    )
}))

vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, variant, size }: any) => (
        <button data-testid={`btn-${variant}-${size || 'default'}`} className={variant}>
            {children}
        </button>
    )
}))

const mockStats = {
    totalVentas: 125,
    ventasHoy: 8,
    productosVendidos: 45,
    ingresoTotal: "$2.450.000"
}

const mockSales = [
    {
        id: 1,
        fecha: '2025-11-30T10:30:00Z',
        total: 899990,
        metodoPago: 'tarjeta',
        estado: 'completada',
        usuario: { name: 'Ana Admin' }
    }
]

const renderDashboard = () => {
    return render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    )
}

describe('Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockDashboardService.getStats.mockResolvedValue(mockStats)
        mockVentasService.getAll.mockResolvedValue(mockSales)
        Object.defineProperty(window, 'alert', { value: vi.fn() })
    })

    it('shows loading spinner initially', () => {
        mockDashboardService.getStats.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        renderDashboard()
        expect(screen.getByText('Cargando datos...')).toBeInTheDocument()
    })

    it('renders dashboard stats after loading', async () => {
        renderDashboard()

        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument()
            expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument()
            expect(screen.getByText('Total: 125')).toBeInTheDocument()
            expect(screen.getByText('Ingreso: $2.450.000')).toBeInTheDocument()
        })
    })

    it('renders recent sales table', async () => {
        renderDashboard()

        await waitFor(() => {
            expect(screen.getByTestId('sales-table')).toBeInTheDocument()
            expect(screen.getByTestId('sale-1')).toBeInTheDocument()
            expect(screen.getByText('Ana Admin')).toBeInTheDocument()
        })
    })

    it('shows error state and retry button', async () => {
        mockDashboardService.getStats.mockRejectedValue(new Error('API Error'))

        renderDashboard()

        await waitFor(() => {
            expect(screen.getByText('Error al cargar los datos del dashboard')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument()
        })
    })

    it('renders navigation quick links', async () => {
        renderDashboard()

        await waitFor(() => screen.getByText('Dashboard'))

        expect(screen.getByTestId('btn-primary-default')).toHaveTextContent('📦 Productos')
        expect(screen.getAllByTestId('btn-secondary-default')[0]).toHaveTextContent('💰 Ventas')
        expect(screen.getByTestId('btn-secondary-sm')).toHaveTextContent('Ver todas las ventas →')
    })

    it('renders feature cards with hover effects', async () => {
        renderDashboard()

        await waitFor(() => screen.getByText('Dashboard'))

        const productCard = screen.getByText('Gestionar Productos').closest('div')
        expect(productCard).toHaveClass('bg-white', 'p-6', 'rounded-lg', 'shadow')

        const salesCard = screen.getByText('Ver Ventas').closest('div')
        expect(salesCard).toHaveClass('hover:shadow-lg', 'transition-shadow')
    })

    it('shows empty sales state', async () => {
        mockVentasService.getAll.mockResolvedValue([])

        renderDashboard()

        await waitFor(() => {
            expect(screen.getByText('No hay ventas registradas aún')).toBeInTheDocument()
            expect(screen.queryByTestId('sales-table')).not.toBeInTheDocument()
        })
    })

    // ✅ FIXED: Data transformation test
    it('transforms sales data correctly for table', async () => {
        renderDashboard()

        await waitFor(() => {
            const saleRow = screen.getByTestId('sale-1')
            expect(saleRow).toHaveTextContent('2025-11-30T10:30:00Z')
            expect(saleRow).toHaveTextContent('$899990')
            expect(saleRow).toHaveTextContent('Ana Admin')
        })

        // Verify transformation happened (usuario.name → cajero)
        expect(screen.getByText('Ana Admin')).toBeInTheDocument()
    })
})
