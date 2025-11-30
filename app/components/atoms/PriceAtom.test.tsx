// src/components/atoms/PriceAtom/PriceAtom.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PriceAtom } from './PriceAtom'

describe('PriceAtom', () => {
    it('renders price with correct Chilean format', () => {
        render(<PriceAtom amount={25000} />)
        expect(screen.getByText('$25.000')).toBeInTheDocument()
    })

    it('formats different amounts correctly', () => {
        render(<PriceAtom amount={1234567} />)
        expect(screen.getByText('$1.234.567')).toBeInTheDocument()
    })

    it('handles zero amount', () => {
        render(<PriceAtom amount={0} />)
        expect(screen.getByText('$0')).toBeInTheDocument()
    })

    it('handles decimal amounts', () => {
        render(<PriceAtom amount={25000.50} />)
        expect(screen.getByText('$25.000')).toBeInTheDocument()
    })

    it('applies default font classes', () => {
        render(<PriceAtom amount={50000} />)
        const priceSpan = screen.getByText('$50.000').closest('span')
        expect(priceSpan).toHaveClass('font-mono', 'font-bold')
    })

    it('applies custom className', () => {
        render(<PriceAtom amount={100000} className="text-2xl text-green-600" />)
        const priceSpan = screen.getByText('$100.000').closest('span')
        expect(priceSpan).toHaveClass('text-2xl', 'text-green-600')
    })

    it('merges default and custom classes', () => {
        render(<PriceAtom amount={75000} className="text-lg" />)
        const priceSpan = screen.getByText('$75.000').closest('span')
        expect(priceSpan).toHaveClass('font-mono', 'font-bold', 'text-lg')
    })
})
