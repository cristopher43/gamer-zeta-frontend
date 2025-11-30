// src/components/molecules/CartItem/CartItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CartItem } from './CartItem'

describe('CartItem', () => {
    const defaultProps = {
        id: 1,
        nombre: 'Mouse Logitech G502',
        precio: 25000,
        cantidad: 2,
        onUpdateQuantity: vi.fn(),
        onRemove: vi.fn()
    }

    it('renders product name and price correctly', () => {
        render(<CartItem {...defaultProps} />)
        expect(screen.getByText('Mouse Logitech G502')).toBeInTheDocument()
        expect(screen.getByText('$25.000 c/u')).toBeInTheDocument()
    })

    it('renders correct total price', () => {
        render(<CartItem {...defaultProps} />)
        expect(screen.getByText('$50.000')).toBeInTheDocument()
    })

    it('renders current quantity', () => {
        render(<CartItem {...defaultProps} />)
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('calls onUpdateQuantity with +1 when + button clicked', () => {
        render(<CartItem {...defaultProps} />)
        fireEvent.click(screen.getByText('+'))
        expect(defaultProps.onUpdateQuantity).toHaveBeenCalledWith(1, 3)
    })

    it('calls onUpdateQuantity with -1 when - button clicked', () => {
        render(<CartItem {...defaultProps} />)
        fireEvent.click(screen.getByText('-'))
        expect(defaultProps.onUpdateQuantity).toHaveBeenCalledWith(1, 1)
    })

    it('disables - button when quantity is 1', () => {
        render(<CartItem {...defaultProps} cantidad={1} />)
        const minusButton = screen.getByText('-')
        expect(minusButton).toBeDisabled()
    })

    it('calls onRemove when remove button clicked', () => {
        render(<CartItem {...defaultProps} />)
        fireEvent.click(screen.getByText('✕'))
        expect(defaultProps.onRemove).toHaveBeenCalledWith(1)
    })

    it('truncates long product names', () => {
        const longName = 'Teclado Mecánico Razer BlackWidow V3 Pro TKL Ultra Low Profile'
        render(<CartItem {...defaultProps} nombre={longName} />)
        const nameElement = screen.getByText(longName)
        expect(nameElement).toHaveClass('truncate')
    })

    it('handles zero quantity display', () => {
        render(<CartItem {...defaultProps} cantidad={0} />)
        expect(screen.getByText('0')).toBeInTheDocument()
    })
})
