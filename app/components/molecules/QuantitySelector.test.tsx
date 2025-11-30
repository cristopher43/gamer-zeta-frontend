// src/components/molecules/QuantitySelector/QuantitySelector.test.tsx
// @ts-ignore
import { render, screen, fireEvent, userEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QuantitySelector } from './QuantitySelector'

// Mock Button
vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, onClick, disabled }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            data-testid={`btn-${children}`}
        >
            {children}
        </button>
    )
}))

describe('QuantitySelector', () => {
    const defaultProps = {
        value: 5,
        onChange: vi.fn(),
        min: 1,
        max: 10
    }

    it('renders correct quantity value', () => {
        render(<QuantitySelector {...defaultProps} />)
        expect(screen.getByDisplayValue('5')).toBeInTheDocument()
    })

    it('disables decrement button when at min', () => {
        render(<QuantitySelector value={1} onChange={defaultProps.onChange} min={1} max={10} />)
        expect(screen.getByTestId('btn--')).toBeDisabled()
    })

    it('disables increment button when at max', () => {
        render(<QuantitySelector value={10} onChange={defaultProps.onChange} min={1} max={10} />)
        expect(screen.getByTestId('btn-+')).toBeDisabled()
    })

    it('increments quantity when + clicked', () => {
        render(<QuantitySelector {...defaultProps} />)
        fireEvent.click(screen.getByTestId('btn-+'))
        expect(defaultProps.onChange).toHaveBeenCalledWith(6)
    })

    it('decrements quantity when - clicked', () => {
        render(<QuantitySelector {...defaultProps} />)
        fireEvent.click(screen.getByTestId('btn--'))
        expect(defaultProps.onChange).toHaveBeenCalledWith(4)
    })

    it('updates via input typing within range', async () => {
        const user = userEvent.setup()
        render(<QuantitySelector {...defaultProps} />)

        await user.clear(screen.getByDisplayValue('5'))
        await user.type(screen.getByDisplayValue(''), '7')
        expect(defaultProps.onChange).toHaveBeenCalledWith(7)
    })

    it('ignores input values outside min/max range', async () => {
        const user = userEvent.setup()
        render(<QuantitySelector {...defaultProps} />)

        await user.clear(screen.getByDisplayValue('5'))
        await user.type(screen.getByDisplayValue(''), '15')  // > max=10
        expect(defaultProps.onChange).not.toHaveBeenCalledWith(15)

        await user.clear(screen.getByDisplayValue('5'))
        await user.type(screen.getByDisplayValue(''), '0')   // < min=1
        expect(defaultProps.onChange).not.toHaveBeenCalledWith(0)
    })

    it('handles custom min/max values', () => {
        render(<QuantitySelector value={0} onChange={vi.fn()} min={0} max={5} />)
        expect(screen.getByTestId('btn--')).toBeDisabled()  // at min=0
    })

    it('applies correct input attributes', () => {
        render(<QuantitySelector {...defaultProps} />)
        const input = screen.getByDisplayValue('5')
        expect(input).toHaveAttribute('type', 'number')
        expect(input).toHaveAttribute('min', '1')
        expect(input).toHaveAttribute('max', '10')
    })
})
