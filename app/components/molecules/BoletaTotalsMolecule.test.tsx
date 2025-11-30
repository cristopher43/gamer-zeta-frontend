// src/components/molecules/BoletaTotalsMolecule/BoletaTotalsMolecule.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BoletaTotalsMolecule } from './BoletaTotalsMolecule'

// Mock PriceAtom
vi.mock('../atoms/PriceAtom', () => ({
    PriceAtom: ({ amount, className }: any) => (
        <span data-testid={`price-${amount}`} className={className}>
      ${amount.toLocaleString('es-CL')}
    </span>
    )
}))

describe('BoletaTotalsMolecule', () => {
    const defaultProps = {
        subtotal: 139990,  // $139.990
        iva: 26598,        // 19% IVA
        total: 166588      // $166.588
    }

    it('renders neto and IVA correctly', () => {
        render(<BoletaTotalsMolecule {...defaultProps} />)
        expect(screen.getByText('Neto')).toBeInTheDocument()
        expect(screen.getByText('IVA 19%')).toBeInTheDocument()
        expect(screen.getByTestId('price-139990')).toBeInTheDocument()
        expect(screen.getByTestId('price-26598')).toBeInTheDocument()
    })

    it('renders TOTAL prominently', () => {
        render(<BoletaTotalsMolecule {...defaultProps} />)
        expect(screen.getByText('TOTAL')).toBeInTheDocument()
        const totalPrice = screen.getByTestId('price-166588')
        expect(totalPrice).toHaveClass('text-4xl', 'md:text-5xl', 'font-black', 'text-emerald-700')
    })

    it('applies correct layout for neto and IVA cards', () => {
        render(<BoletaTotalsMolecule {...defaultProps} />)
        const netoCard = screen.getByText('Neto').closest('div')
        const ivaCard = screen.getByText('IVA 19%').closest('div')

        expect(netoCard).toHaveClass('bg-white', 'p-6', 'rounded-2xl', 'border', 'shadow-md')
        expect(ivaCard).toHaveClass('bg-white', 'p-6', 'rounded-2xl', 'border', 'shadow-md')
    })

    it('applies gradient backgrounds', () => {
        const { container } = render(<BoletaTotalsMolecule {...defaultProps} />)
        const mainContainer = container.firstChild
        expect(mainContainer).toHaveClass('bg-gradient-to-r', 'from-emerald-50', 'via-blue-50', 'to-purple-50')

        const totalContainer = screen.getByText('TOTAL').closest('div')
        expect(totalContainer).toHaveClass('bg-gradient-to-r', 'from-emerald-100', 'to-blue-100')
    })

    it('handles zero values correctly', () => {
        render(<BoletaTotalsMolecule subtotal={0} iva={0} total={0} />)
        expect(screen.getByTestId('price-0')).toBeInTheDocument()
    })

    it('applies print styles', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: query === '(print)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        })

        const { container } = render(<BoletaTotalsMolecule {...defaultProps} />)
        const mainContainer = container.firstChild
        // Print styles: bg-white, shadow-none, border-2, etc.
        expect(mainContainer).toHaveClass('print:bg-white', 'print:shadow-none')
    })
})
