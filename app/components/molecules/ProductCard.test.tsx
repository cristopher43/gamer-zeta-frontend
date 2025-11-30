// src/components/molecules/ProductCard/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProductCard } from './ProductCard'

// Mock subcomponents
vi.mock('~/components/atoms/Button', () => ({
        Button: ({ children, onClick, disabled }: any) => (
            <button
                onClick={onClick}
        disabled={disabled}
        data-testid="add-to-cart-btn"
            >
            {children}
            </button>
)
}))

vi.mock('~/components/atoms/Badge', () => ({
        Badge: ({ children, variant }: any) => (
            <span data-testid={`badge-${variant}`}>{children}</span>
)
}))

vi.mock('~/components/atoms/Image', () => ({
    Image: () => <img data-testid="product-image" alt="product" />
}))

const defaultProps = {
    id: 1,
    nombre: 'Mouse Logitech G502',
    precio: 25000,
    stock: 10,
    onAddToCart: vi.fn()
}

describe('ProductCard', () => {
    it('renders product info correctly', () => {
        render(<ProductCard {...defaultProps} />)
        expect(screen.getByText('Mouse Logitech G502')).toBeInTheDocument()
        expect(screen.getByText('$25.000')).toBeInTheDocument()
        expect(screen.getByText('Stock: 10')).toBeInTheDocument()
    })

    it('shows placeholder when no image', () => {
        render(<ProductCard {...defaultProps} imagen={undefined} />)
        expect(screen.getByText('🎮')).toBeInTheDocument()
    })

    it('shows product image when imagen provided', () => {
        render(<ProductCard {...defaultProps} imagen="mouse.jpg" />)
        expect(screen.getByTestId('product-image')).toBeInTheDocument()
    })

    it('truncates long product names', () => {
        render(<ProductCard
            {...defaultProps}
        nombre="Teclado Mecánico Razer BlackWidow V3 Pro TKL Ultra Low Profile Gaming"
            />)
        const nameElement = screen.getByText(/Teclado Mecánico Razer BlackWidow/)
        expect(nameElement).toHaveClass('truncate')
    })

    it('calls onAddToCart when button clicked with stock', () => {
        render(<ProductCard {...defaultProps} />)
        fireEvent.click(screen.getByTestId('add-to-cart-btn'))
        expect(defaultProps.onAddToCart).toHaveBeenCalledWith(1)
    })

    it('disables button when stock=0', () => {
        render(<ProductCard {...defaultProps} stock={0} />)
        expect(screen.getByTestId('add-to-cart-btn')).toBeDisabled()
        expect(screen.getByTestId('add-to-cart-btn')).toHaveTextContent('Sin stock')
    })

    it('shows warning badge when stock <= 5', () => {
        render(<ProductCard {...defaultProps} stock={3} />)
        expect(screen.getByTestId('badge-warning')).toHaveTextContent('Poco stock')
    })

    it('shows danger badge when stock = 0', () => {
        render(<ProductCard {...defaultProps} stock={0} />)
        expect(screen.getByTestId('badge-danger')).toHaveTextContent('Agotado')
    })

    it('applies hover shadow effect classes', () => {
        const { container } = render(<ProductCard {...defaultProps} />)
        const card = container.firstChild
        expect(card).toHaveClass('border', 'rounded-lg', 'p-4', 'shadow-sm', 'hover:shadow-md', 'transition-shadow')
    })
})
