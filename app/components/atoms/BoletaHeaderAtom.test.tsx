// src/components/atoms/BoletaHeaderAtom/BoletaHeaderAtom.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BoletaHeaderAtom } from './BoletaHeaderAtom'

describe('BoletaHeaderAtom', () => {
    const defaultProps = {
        numero: 'B000123',
        fecha: '30/11/2025'
    }

    it('renders empresa name', () => {
        render(<BoletaHeaderAtom {...defaultProps} />)
        expect(screen.getByText('GAMER ZETA')).toBeInTheDocument()
    })

    it('renders empresa subtitle', () => {
        render(<BoletaHeaderAtom {...defaultProps} />)
        expect(screen.getByText('Tienda Gaming - Santiago, Chile')).toBeInTheDocument()
    })

    it('renders correct boleta number', () => {
        render(<BoletaHeaderAtom numero="B000123" fecha="30/11/2025" />)
        expect(screen.getByText('Boleta Nº:')).toBeInTheDocument()
        expect(screen.getByText('B000123')).toBeInTheDocument()
    })

    it('renders correct fecha emisión', () => {
        render(<BoletaHeaderAtom numero="B000123" fecha="30/11/2025" />)
        expect(screen.getByText('Fecha Emisión:')).toBeInTheDocument()
        expect(screen.getByText('30/11/2025')).toBeInTheDocument()
    })

    it('renders logo container', () => {
        render(<BoletaHeaderAtom {...defaultProps} />)
        const logo = screen.getByText('GZ').closest('div')
        expect(logo).not.toBeNull()
        expect(logo).toHaveClass('w-24', 'h-24', 'rounded-2xl')
    })

    it('has correct layout structure', () => {
        render(<BoletaHeaderAtom {...defaultProps} />)

        // Logo + Empresa + Datos
        expect(screen.getByText('GZ')).toBeInTheDocument()
        expect(screen.getByText('GAMER ZETA')).toBeInTheDocument()
        expect(screen.getByText('Boleta Nº:')).toBeInTheDocument()
        expect(screen.getByText('Fecha Emisión:')).toBeInTheDocument()
    })
})
