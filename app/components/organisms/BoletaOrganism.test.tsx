// src/components/organisms/BoletaOrganism/BoletaOrganism.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BoletaOrganism } from './BoletaOrganism'

// Mock subcomponents
vi.mock('../atoms/BoletaHeaderAtom', () => ({
    BoletaHeaderAtom: ({ numero, fecha }: any) => (
        <div data-testid="boleta-header">{numero} - {fecha}</div>
    )
}))

vi.mock('../molecules/CartItem', () => ({
    CartItem: ({ nombre, precio, cantidad }: any) => (
        <div data-testid="cart-item">
            {nombre} - ${precio} x {cantidad}
        </div>
    )
}))

vi.mock('../molecules/BoletaTotalsMolecule', () => ({
    BoletaTotalsMolecule: ({ subtotal, iva, total }: any) => (
        <div data-testid="boleta-totals">
            Subtotal: ${subtotal} | IVA: ${iva} | Total: ${total}
        </div>
    )
}))

const defaultProps = {
    boleta: { numero: 'B000123', cliente: 'Juan Pérez', rut: '12345678-9' },
    venta: { subtotal: 25000, iva: 4225, total: 29225 },
    cartItems: [
        { id: 1, nombre: 'Mouse Logitech', precio: 25000, cantidad: 1 }
    ],
    metodoPago: 'Efectivo',
    cajero: 'Ana Gómez',
    onClose: vi.fn(),
    onPrint: vi.fn()
}

describe('BoletaOrganism', () => {
    it('renders modal overlay', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByTestId('boleta-header')).toBeInTheDocument()
    })

    it('renders boleta header correctly', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByText('B000123')).toBeInTheDocument()
    })

    it('renders client information', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        expect(screen.getByText('RUT: 12345678-9')).toBeInTheDocument()
    })

    it('renders venta details', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByText('Método: Efectivo')).toBeInTheDocument()
        expect(screen.getByText('Cajero: Ana Gómez')).toBeInTheDocument()
    })

    it('renders cart items', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByTestId('cart-item')).toHaveTextContent('Mouse Logitech')
    })

    it('renders totals', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByTestId('boleta-totals')).toHaveTextContent('Total: $29225')
    })

    it('renders thank you message', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByText('¡GRACIAS POR TU COMPRA!')).toBeInTheDocument()
    })

    it('calls onPrint when print button clicked', () => {
        render(<BoletaOrganism {...defaultProps} />)
        fireEvent.click(screen.getByRole('button', { name: /🖨️ Imprimir/i }))
        expect(defaultProps.onPrint).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when close button clicked', () => {
        render(<BoletaOrganism {...defaultProps} />)
        fireEvent.click(screen.getByRole('button', { name: /Cerrar/i }))
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    // ✅ FIXED: Test para consumidor final
    it('shows consumidor final when no client', () => {
        const noClientProps = {
            ...defaultProps,
            boleta: { ...defaultProps.boleta, cliente: '', rut: '' }
        }

        render(<BoletaOrganism {...noClientProps} />)
        expect(screen.getByText('CONSUMIDOR FINAL')).toBeInTheDocument()
        expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument()
    })

    it('handles multiple cart items', () => {
        const multiItemProps = {
            ...defaultProps,
            cartItems: [
                { id: 1, nombre: 'Mouse Logitech', precio: 25000, cantidad: 1 },
                { id: 2, nombre: 'Teclado', precio: 45000, cantidad: 2 }
            ]
        }

        render(<BoletaOrganism {...multiItemProps} />)
        expect(screen.getAllByTestId('cart-item')).toHaveLength(2)
    })

    it('formats totals correctly', () => {
        render(<BoletaOrganism {...defaultProps} />)
        expect(screen.getByTestId('boleta-totals')).toHaveTextContent('$25.000')
        expect(screen.getByTestId('boleta-totals')).toHaveTextContent('$4.225')
    })

    it('passes correct props to subcomponents', () => {
        render(<BoletaOrganism {...defaultProps} />)

        expect(screen.getByTestId('boleta-header')).toHaveTextContent('B000123')
        expect(screen.getByTestId('cart-item')).toHaveTextContent('$25000 x 1')
        expect(screen.getByTestId('boleta-totals')).toHaveTextContent('Total: $29225')
    })
})
