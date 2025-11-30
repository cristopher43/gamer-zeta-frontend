// src/components/organisms/ShoppingCart/ShoppingCart.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ShoppingCart } from './ShoppingCart'

// Mock subcomponents
vi.mock('~/components/molecules/CartItem', () => ({
    CartItem: ({ nombre, onRemove }: any) => (
        <div data-testid={`cart-item-${nombre}`}>
            {nombre}
            <button onClick={() => onRemove(1)} data-testid="remove-btn">Remove</button>
        </div>
    )
}))

vi.mock('~/components/molecules/PriceDisplay', () => ({
    PriceDisplay: ({ label, amount }: any) => (
        <div data-testid={`price-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {label}: ${amount.toLocaleString('es-CL')}
        </div>
    )
}))

vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, onClick, isLoading, disabled }: any) => (
        <button
            onClick={onClick}
            data-loading={isLoading}
            disabled={disabled}
            data-testid="checkout-btn"
        >
            {children}
        </button>
    )
}))

vi.mock('~/components/atoms/Divider', () => ({
    Divider: () => <hr data-testid="divider" />
}))

const mockItems = [
    { id: 1, nombre: 'Mouse Logitech', precio: 25000, cantidad: 2 },
    { id: 2, nombre: 'Teclado Mecánico', precio: 89990, cantidad: 1 }
]

describe('ShoppingCart', () => {
    const mockCallbacks = {
        onUpdateQuantity: vi.fn(),
        onRemove: vi.fn(),
        onCheckout: vi.fn()
    }

    it('renders empty cart state', () => {
        render(<ShoppingCart items={[]} {...mockCallbacks} />)
        expect(screen.getByText('🛒')).toBeInTheDocument()
        expect(screen.getByText('El carrito está vacío')).toBeInTheDocument()
    })

    it('renders cart items when items exist', () => {
        render(<ShoppingCart items={mockItems} {...mockCallbacks} />)
        expect(screen.getByTestId('cart-item-Mouse Logitech')).toBeInTheDocument()
        expect(screen.getByTestId('cart-item-Teclado Mecánico')).toBeInTheDocument()
    })

    it('calculates correct subtotal, IVA and total', () => {
        render(<ShoppingCart items={mockItems} {...mockCallbacks} />)

        expect(screen.getByTestId('price-subtotal')).toHaveTextContent('$139.990')
        expect(screen.getByTestId('price-iva (19%)')).toHaveTextContent('$26.598')
        expect(screen.getByTestId('price-total')).toHaveTextContent('$166.588')
    })

    it('renders checkout button disabled on empty cart', () => {
        render(<ShoppingCart items={[]} {...mockCallbacks} />)
        expect(screen.getByTestId('checkout-btn')).toBeDisabled()
    })

    it('renders checkout button enabled with items', () => {
        render(<ShoppingCart items={mockItems} {...mockCallbacks} />)
        expect(screen.getByTestId('checkout-btn')).not.toBeDisabled()
    })

    it('shows loading state on checkout button', () => {
        render(<ShoppingCart items={mockItems} {...mockCallbacks} isProcessing />)
        expect(screen.getByTestId('checkout-btn')).toHaveAttribute('data-loading', 'true')
    })

    it('calls onCheckout when checkout clicked', () => {
        render(<ShoppingCart items={mockItems} {...mockCallbacks} />)
        fireEvent.click(screen.getByTestId('checkout-btn'))
        expect(mockCallbacks.onCheckout).toHaveBeenCalledTimes(1)
    })

    it('renders dividers correctly', () => {
        render(<ShoppingCart items={mockItems} {...mockCallbacks} />)
        expect(screen.getAllByTestId('divider')).toHaveLength(2)
    })
})
