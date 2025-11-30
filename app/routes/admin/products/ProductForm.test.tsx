// src/components/ProductForm/ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes, useParams } from 'react-router'
import ProductForm from './ProductForm'

// Mock services
const mockProductosService = {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
}

vi.mock('~/services/api/productosService', () => ({
    productosService: mockProductosService
}))

// Mock Button
vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, type, disabled }: any) => (
        <button data-testid={`btn-${type}`} disabled={disabled}>
            {children}
        </button>
    )
}))

// Mock Router params for testing
const TestProductForm = ({ productId }: { productId?: string }) => (
    <MemoryRouter initialEntries={[`/admin/products/${productId || ''}`]}>
        <Routes>
            <Route path="/admin/products/:id?" element={<ProductForm />} />
            <Route path="/admin/products" element={<div data-testid="products-list">Products List</div>} />
        </Routes>
    </MemoryRouter>
)

describe('ProductForm', () => {
    const user = userEvent.setup()
    const mockNavigate = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        Object.defineProperty(window, 'alert', { value: vi.fn() })
    })

    it('shows loading state when editing', async () => {
        mockProductosService.getById.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        render(<TestProductForm productId="1" />)
        expect(screen.getByText('Cargando producto...')).toBeInTheDocument()
    })

    it('renders create form title and default values', () => {
        render(<TestProductForm />)
        expect(screen.getByText('Nuevo Producto')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Consolas')).toBeInTheDocument()
    })

    it('renders edit form title', async () => {
        mockProductosService.getById.mockResolvedValue({
            id: 1,
            nombre: 'PS5',
            precio: 899990,
            stock: 10,
            categoria: 'Consolas',
            activo: true
        })

        render(<TestProductForm productId="1" />)

        await waitFor(() => {
            expect(screen.getByText('Editar Producto')).toBeInTheDocument()
            expect(screen.getByDisplayValue('PS5')).toBeInTheDocument()
        })
    })

    it('validates required fields on submit', async () => {
        render(<TestProductForm />)

        fireEvent.click(screen.getByTestId('btn-submit'))

        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
        expect(screen.getByText('El precio debe ser mayor a 0')).toBeInTheDocument()
    })

    it('clears errors when typing', async () => {
        render(<TestProductForm />)

        fireEvent.click(screen.getByTestId('btn-submit'))
        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()

        await user.type(screen.getByLabelText(/Nombre del Producto/), 'PS5')
        await waitFor(() => {
            expect(screen.queryByText('El nombre es requerido')).not.toBeInTheDocument()
        })
    })

    it('submits create form successfully', async () => {
        mockProductosService.create.mockResolvedValue({ id: 1 })

        render(<TestProductForm />)

        await user.type(screen.getByLabelText(/Nombre del Producto/), 'PS5 Slim')
        await user.type(screen.getByLabelText(/Precio/), '899990')
        await user.type(screen.getByLabelText(/Stock/), '10')

        fireEvent.click(screen.getByTestId('btn-submit'))

        await waitFor(() => {
            expect(mockProductosService.create).toHaveBeenCalledWith({
                nombre: 'PS5 Slim',
                descripcion: '',
                precio: 899990,
                stock: 10,
                categoria: 'Consolas'
            })
        })
    })

    it('submits update form successfully', async () => {
        mockProductosService.getById.mockResolvedValue({
            id: 1,
            nombre: 'PS5',
            precio: 899990,
            stock: 10,
            categoria: 'Consolas',
            activo: true
        })
        mockProductosService.update.mockResolvedValue({})

        render(<TestProductForm productId="1" />)

        await waitFor(() => screen.getByDisplayValue('PS5'))

        await user.clear(screen.getByLabelText(/Nombre del Producto/))
        await user.type(screen.getByLabelText(/Nombre del Producto/), 'PS5 Slim')

        fireEvent.click(screen.getByTestId('btn-submit'))

        await waitFor(() => {
            expect(mockProductosService.update).toHaveBeenCalledWith(1, expect.objectContaining({
                nombre: 'PS5 Slim'
            }))
        })
    })

    it('shows activo checkbox only in edit mode', async () => {
        mockProductosService.getById.mockResolvedValue({ activo: true })

        render(<TestProductForm productId="1" />)

        await waitFor(() => {
            expect(screen.getByLabelText(/Producto activo/)).toBeInTheDocument()
        })

        render(<TestProductForm />)
        expect(screen.queryByLabelText(/Producto activo/)).not.toBeInTheDocument()
    })
})
