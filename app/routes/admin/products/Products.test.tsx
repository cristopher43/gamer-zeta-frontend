// src/components/Products/Products.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router'
import Products from './Products'

// Mock services
const mockProductosService = {
    getAll: vi.fn(),
    delete: vi.fn()
}

vi.mock('~/services/api/productosService', () => ({
    productosService: mockProductosService
}))

// Mock components
vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick} data-testid={`btn-${children}`}>
            {children}
        </button>
    )
}))

vi.mock('~/components/molecules/SearchBar', () => ({
    SearchBar: ({ value, onChange }: any) => (
        <input
            data-testid="search-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}))

vi.mock('~/components/atoms/Badge', () => ({
    Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}))

vi.mock('~/components/molecules/DeleteModal', () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="delete-modal" /> : null
}))

const mockProducts = [
    {
        id: 1,
        nombre: 'PlayStation 5',
        descripcion: 'Consola next-gen',
        precio: 899990,
        stock: 3,
        categoria: 'Consolas',
        activo: true
    },
    {
        id: 2,
        nombre: 'Mouse Logitech G502',
        precio: 25000,
        stock: 15,
        categoria: 'Periféricos',
        activo: true
    }
]

const renderProducts = () => {
    return render(
        <MemoryRouter>
            <Products />
        </MemoryRouter>
    )
}

describe('Products', () => {
    const user = userEvent.setup()

    beforeEach(() => {
        vi.clearAllMocks()
        mockProductosService.getAll.mockResolvedValue(mockProducts)
        Object.defineProperty(window, 'alert', { value: vi.fn() })
    })

    it('shows loading spinner initially', () => {
        mockProductosService.getAll.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        renderProducts()
        expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
    })

    it('renders products table after loading', async () => {
        renderProducts()

        await waitFor(() => {
            expect(screen.getByText('Gestión de Productos')).toBeInTheDocument()
            expect(screen.getAllByRole('row')).toHaveLength(7) // header + 2 products + empty row if needed
            expect(screen.getByText('PlayStation 5')).toBeInTheDocument()
            expect(screen.getByText('$899.990')).toBeInTheDocument()
        })
    })

    it('filters products by search', async () => {
        renderProducts()

        await waitFor(() => screen.getByText('PlayStation 5'))

        await user.type(screen.getByTestId('search-input'), 'mouse')
        await waitFor(() => {
            expect(screen.getByText('Mouse Logitech G502')).toBeInTheDocument()
            expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument()
        })
    })

    it('shows empty state when no products match search', async () => {
        renderProducts()

        await waitFor(() => screen.getByText('PlayStation 5'))
        await user.type(screen.getByTestId('search-input'), 'xyz')

        await waitFor(() => {
            expect(screen.getByText('No se encontraron productos con ese criterio')).toBeInTheDocument()
        })
    })

    it('navigates to create product', async () => {
        const mockNavigate = vi.fn()
        vi.mock('react-router', () => ({
            useNavigate: () => mockNavigate,
            // other mocks
        }))

        renderProducts()
        await waitFor(() => screen.getByText('Gestión de Productos'))

        fireEvent.click(screen.getByTestId('btn-+ Nuevo Producto'))
        expect(mockNavigate).toHaveBeenCalledWith('/admin/products/new')
    })

    it('opens delete modal on delete click', async () => {
        renderProducts()

        await waitFor(() => screen.getByText('PlayStation 5'))
        fireEvent.click(screen.getAllByText('Eliminar')[0])

        await waitFor(() => {
            expect(screen.getByTestId('delete-modal')).toBeInTheDocument()
        })
    })

    it('deletes product successfully', async () => {
        mockProductosService.delete.mockResolvedValue({})

        renderProducts()

        await waitFor(() => screen.getByText('PlayStation 5'))
        fireEvent.click(screen.getAllByText('Eliminar')[0])

        // Simulate modal confirm
        fireEvent.click(screen.getByTestId('delete-modal')) // assuming modal handles this

        await waitFor(() => {
            expect(mockProductosService.delete).toHaveBeenCalledWith(1)
            expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument()
        })
    })

    it('shows stock warning styling for low stock', async () => {
        renderProducts()

        await waitFor(() => screen.getByText('PlayStation 5'))
        const stockCell = screen.getByText('3').closest('td')
        expect(stockCell).toHaveClass('text-red-600', 'font-semibold')
    })

    it('shows products counter', async () => {
        renderProducts()

        await waitFor(() => {
            expect(screen.getByText('Mostrando 2 de 2 productos')).toBeInTheDocument()
        })
    })
})
