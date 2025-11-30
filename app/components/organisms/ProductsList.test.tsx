// src/components/organisms/ProductList/ProductList.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ProductList } from './ProductList'

// Mock subcomponents
vi.mock('~/components/molecules/ProductCard', () => ({
    ProductCard: ({ nombre, onAddToCart }: any) => (
        <div data-testid={`product-${nombre}`} onClick={() => onAddToCart(1)}>
            {nombre}
        </div>
    )
}))

vi.mock('~/components/molecules/SearchBar', () => ({
    SearchBar: ({ value, onChange, placeholder }: any) => (
        <input
            data-testid="search-input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
}))

vi.mock('~/components/atoms/Spinner', () => ({
    Spinner: () => <div data-testid="spinner" />
}))

const mockProducts = [
    { id: 1, nombre: 'Mouse Logitech', precio: 25000, stock: 10, categoria: 'Periféricos' },
    { id: 2, nombre: 'Teclado Mecánico', precio: 89990, stock: 5, categoria: 'Periféricos' },
    { id: 3, nombre: 'Monitor 24"', precio: 159990, stock: 3, categoria: 'Monitores' }
]

describe('ProductList', () => {
    const user = userEvent.setup()
    const mockOnAddToCart = vi.fn()

    it('renders loading spinner when isLoading=true', () => {
        render(<ProductList products={[]} onAddToCart={mockOnAddToCart} isLoading />)
        expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })

    it('renders all products when no search term', () => {
        render(<ProductList products={mockProducts} onAddToCart={mockOnAddToCart} />)
        expect(screen.getAllByTestId(/^product-/)).toHaveLength(3)
        expect(screen.getByText('Mouse Logitech')).toBeInTheDocument()
        expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument()
        expect(screen.getByText('Monitor 24"')).toBeInTheDocument()
    })

    it('filters products by name search', async () => {
        render(<ProductList products={mockProducts} onAddToCart={mockOnAddToCart} />)

        await user.type(screen.getByTestId('search-input'), 'mouse')
        expect(screen.getByText('Mouse Logitech')).toBeInTheDocument()
        expect(screen.queryByText('Teclado Mecánico')).not.toBeInTheDocument()
    })

    it('filters products by category search', async () => {
        render(<ProductList products={mockProducts} onAddToCart={mockOnAddToCart} />)

        await user.type(screen.getByTestId('search-input'), 'periféricos')
        expect(screen.getAllByTestId(/^product-/)).toHaveLength(2)
    })

    it('shows empty state when no products match', async () => {
        render(<ProductList products={mockProducts} onAddToCart={mockOnAddToCart} />)

        await user.type(screen.getByTestId('search-input'), 'xyz-no-existe')
        expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
    })

    it('calls onAddToCart when product clicked', async () => {
        render(<ProductList products={mockProducts} onAddToCart={mockOnAddToCart} />)

        fireEvent.click(screen.getByText('Mouse Logitech'))
        expect(mockOnAddToCart).toHaveBeenCalledWith(1)
    })

    it('applies responsive grid classes', () => {
        const { container } = render(<ProductList products={mockProducts} onAddToCart={mockOnAddToCart} />)
        const grid = screen.getAllByTestId(/^product-/)[0].parentElement
        expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-4')
    })

    it('handles empty products array', () => {
        render(<ProductList products={[]} onAddToCart={mockOnAddToCart} />)
        expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
    })
})
