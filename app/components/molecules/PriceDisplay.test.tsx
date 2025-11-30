// src/components/molecules/PriceDisplay/PriceDisplay.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PriceDisplay } from './PriceDisplay'

describe('PriceDisplay', () => {
    it('renders normal price display correctly', () => {
        render(<PriceDisplay label="Subtotal" amount={139990} />)
        expect(screen.getByText('Subtotal')).toHaveClass('text-gray-600')
        expect(screen.getByText('$139.990')).toHaveClass('text-gray-700')
    })

    it('renders emphasized price display correctly', () => {
        render(<PriceDisplay label="Total" amount={166588} emphasized />)
        expect(screen.getByText('Total')).toHaveClass('text-gray-900', 'font-bold', 'text-lg')
        expect(screen.getByText('$166.588')).toHaveClass('text-gray-900', 'font-bold', 'text-lg')
    })

    it('formats Chilean locale correctly', () => {
        render(<PriceDisplay label="IVA" amount={26598} />)
        expect(screen.getByText('$26.598')).toBeInTheDocument()

        render(<PriceDisplay label="Producto" amount={25000} />)
        expect(screen.getByText('$25.000')).toBeInTheDocument()
    })

    it('handles zero amount correctly', () => {
        render(<PriceDisplay label="Descuento" amount={0} />)
        expect(screen.getByText('$0')).toBeInTheDocument()
    })

    it('handles decimal amounts correctly', () => {
        render(<PriceDisplay label="Envío" amount={5990.50} />)
        expect(screen.getByText('$5.990')).toBeInTheDocument()
    })

    it('applies flex layout classes', () => {
        const { container } = render(<PriceDisplay label="Subtotal" amount={100000} />)
        const priceRow = container.firstChild
        expect(priceRow).toHaveClass('flex', 'justify-between', 'items-center')
    })

    it('renders multiple price displays correctly', () => {
        render(
            <>
                <PriceDisplay label="Subtotal" amount={139990} />
                <PriceDisplay label="IVA 19%" amount={26598} />
                <PriceDisplay label="TOTAL" amount={166588} emphasized />
            </>
        )
        expect(screen.getAllByText(/\$/)).toHaveLength(3)
        expect(screen.getByText('TOTAL')).toHaveClass('font-bold', 'text-lg')
    })
})
