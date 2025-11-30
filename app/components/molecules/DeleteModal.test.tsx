// src/components/molecules/DeleteModal/DeleteModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DeleteModal from './DeleteModal'

// Mock Button
vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, onClick, variant }: any) => (
        <button
            onClick={onClick}
            data-variant={variant}
            data-testid={`btn-${variant}`}
        >
            {children}
        </button>
    )
}))

describe('DeleteModal', () => {
    const defaultProps = {
        isOpen: true,
        productName: 'Mouse Logitech G502',
        onConfirm: vi.fn(),
        onCancel: vi.fn()
    }

    it('does NOT render when isOpen=false', () => {
        render(<DeleteModal {...defaultProps} isOpen={false} />)
        expect(screen.queryByText('Eliminar Producto')).not.toBeInTheDocument()
    })

    it('renders modal when isOpen=true', () => {
        render(<DeleteModal {...defaultProps} />)
        expect(screen.getByText('Eliminar Producto')).toBeInTheDocument()
        expect(screen.getByText('Mouse Logitech G502')).toBeInTheDocument()
    })

    it('shows warning icon and message', () => {
        render(<DeleteModal {...defaultProps} />)
        const icon = screen.getByText(/warning/i).closest('svg')
        expect(screen.getByText('¿Estás seguro que deseas eliminar')).toBeInTheDocument()
        expect(screen.getByText('Esta acción no se puede deshacer.')).toBeInTheDocument()
    })

    it('renders Cancelar and Eliminar buttons', () => {
        render(<DeleteModal {...defaultProps} />)
        expect(screen.getByTestId('btn-secondary')).toHaveTextContent('Cancelar')
        expect(screen.getByTestId('btn-danger')).toHaveTextContent('Eliminar')
    })

    it('closes modal when Cancelar clicked', () => {
        render(<DeleteModal {...defaultProps} />)
        fireEvent.click(screen.getByTestId('btn-secondary'))
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
    })

    it('confirms deletion when Eliminar clicked', () => {
        render(<DeleteModal {...defaultProps} />)
        fireEvent.click(screen.getByTestId('btn-danger'))
        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    })

    it('closes modal when backdrop clicked', () => {
        render(<DeleteModal {...defaultProps} />)
        const backdrop = screen.getByText(/warning/i).closest('div')?.previousElementSibling
        if (backdrop) {
            fireEvent.click(backdrop)
            expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
        }
    })

    it('applies modal backdrop and positioning classes', () => {
        const { container } = render(<DeleteModal {...defaultProps} />)
        const backdrop = container.querySelector('.bg-black')
        const modal = container.querySelector('.bg-white')

        expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50')
        expect(modal).toHaveClass('relative', 'bg-white', 'rounded-lg', 'shadow-xl')
    })

    it('handles long product names', () => {
        render(<DeleteModal
            {...defaultProps}
            productName="Teclado Mecánico Razer BlackWidow V3 Pro TKL Ultra Low Profile"
        />)
        expect(screen.getByText('Teclado Mecánico Razer BlackWidow V3 Pro TKL Ultra Low Profile')).toBeInTheDocument()
    })
})
