// src/components/CashierHome/CashierHome.test.tsx
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CashierHome from './CashierHome'

// Mock services
const mockProductosService = {
    getAll: vi.fn()
}

const mockVentasService = {
    create: vi.fn()
}

vi.mock('~/services/api/productosService', () => ({
    productosService: mockProductosService
}))

vi.mock('~/services/api/ventasService', () => ({
    ventasService: mockVentasService
}))

// Mock AuthContext
const mockUseAuth = vi.fn()
vi.mock('~/context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 2, name: 'Ana Admin' }
    })
}))

// Mock components
vi.mock('~/components/organisms/ShoppingCart', () => ({
    ShoppingCart: ({ items, onCheckout }: any) => (
        <div data-testid="shopping-cart">
            <div>Items: {items.length}</div>
            <button onClick={onCheckout} data-testid="checkout-btn">Checkout</button>
        </div>
    )
}))

vi.mock('~/components/molecules/AlertMessage', () => ({
    AlertMessage: ({ type, message }: any) => (
        <div data-testid={`alert-${type}`}>{message}</div>
    )
}))

vi.mock('~/components/organisms/BoletaOrganism', () => ({
    BoletaOrganism: ({ onClose }: any) => (
        <div data-testid="boleta-modal">
            <button onClick={onClose}>Close Boleta</button>
        </div>
    )
}))

const mockProducts = [
    {
        id: 1,
        nombre: 'PlayStation 5',
        precio: 899990,
        stock: 3,
        activo: true,
        imagen: ''
    },
    {
        id: 2,
        nombre: 'Mouse Logitech',
        precio: 25000,
        stock: 15,
        activo: true
    }
]

describe('CashierHome', () => {
    const user = userEvent.setup()

    beforeEach(() => {
        vi.clearAllMocks()
        mockProductosService.getAll.mockResolvedValue(mockProducts)
        mockVentasService.create.mockResolvedValue({ boleta: { id: 123 }, venta: { total: 899990 } })
    })

    it('shows loading state initially', () => {
        mockProductosService.getAll.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        render(<CashierHome />)
        expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
    })

    it('renders products grid after loading', async () => {
        render(<CashierHome />)

        await waitFor(() => {
            expect(screen.getByText('Punto de Venta')).toBeInTheDocument()
            expect(screen.getByText('PlayStation 5')).toBeInTheDocument()
            expect(screen.getByText('$899.990')).toBeInTheDocument()
        })
    })

    it('shows stock badge styling', async () => {
        render(<CashierHome />)

        await waitFor(() => screen.getByText('PlayStation 5'))

        const ps5Stock = screen.getByText('Stock: 3').closest('p')
        expect(ps5Stock).toHaveClass('bg-yellow-100', 'text-yellow-800')

        const mouseStock = screen.getByText('Stock: 15').closest('p')
        expect(mouseStock).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('adds product to cart', async () => {
        render(<CashierHome />)

        await waitFor(() => screen.getByText('PlayStation 5'))

        // @ts-ignore
        const qtyInput = screen.getByDisplayValue('1', { selector: '[id^="qty-"]' })
        fireEvent.change(qtyInput, { target: { value: '2' } })

        const addBtn = screen.getAllByText('➕ Agregar')[0]
        fireEvent.click(addBtn)

        await waitFor(() => {
            const cart = screen.getByTestId('shopping-cart')
            expect(within(cart).getByText('Items: 1')).toBeInTheDocument()
        })
    })

    it('shows stock error when exceeding stock', async () => {
        render(<CashierHome />)

        await waitFor(() => screen.getByText('PlayStation 5'))

        const ps5Card = screen.getByText('PlayStation 5').closest('div')
        const qtyInput = within(ps5Card!).getByDisplayValue('1')
        fireEvent.change(qtyInput, { target: { value: '5' } }) // > stock 3

        const addBtn = within(ps5Card!).getByText('➕ Agregar')
        fireEvent.click(addBtn)

        await waitFor(() => {
            expect(screen.getByTestId('alert-error')).toHaveTextContent('Stock insuficiente. Solo hay 3 disponibles.')
        })
    })

    it('opens payment modal on checkout', async () => {
        render(<CashierHome />)

        await waitFor(() => screen.getByTestId('shopping-cart'))

        fireEvent.click(screen.getByTestId('checkout-btn'))

        await waitFor(() => {
            expect(screen.getByText('Finalizar Venta')).toBeInTheDocument()
            expect(screen.getByText('💵 Efectivo')).toBeInTheDocument()
        })
    })

    it('completes checkout successfully', async () => {
        render(<CashierHome />)

        // First add product
        await waitFor(() => screen.getByText('PlayStation 5'))
        fireEvent.click(screen.getAllByText('➕ Agregar')[0])

        // Open checkout
        fireEvent.click(screen.getByTestId('checkout-btn'))
        await waitFor(() => screen.getByText('Finalizar Venta'))

        // Complete checkout
        fireEvent.click(screen.getByText('✅ Confirmar Venta'))

        await waitFor(() => {
            expect(mockVentasService.create).toHaveBeenCalled()
            expect(screen.getByTestId('boleta-modal')).toBeInTheDocument()
            expect(screen.getByTestId('alert-success')).toHaveTextContent('¡Venta realizada exitosamente!')
        })
    })

    it('shows error on empty cart checkout', async () => {
        render(<CashierHome />)

        fireEvent.click(screen.getByTestId('checkout-btn'))

        await waitFor(() => {
            expect(screen.getByTestId('alert-error')).toHaveTextContent('El carrito está vacío')
        })
    })

    it('closes boleta modal', async () => {
        render(<CashierHome />)

        // Simulate checkout completion
        mockVentasService.create.mockResolvedValue({ boleta: { id: 123 } })

        await waitFor(() => screen.getByTestId('boleta-modal'))
        fireEvent.click(screen.getByText('Close Boleta'))

        await waitFor(() => {
            expect(screen.queryByTestId('boleta-modal')).not.toBeInTheDocument()
        })
    })
})
