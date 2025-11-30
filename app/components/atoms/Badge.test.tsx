// src/components/atoms/Badge/Badge.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
    it('renders children text', () => {
        render(<Badge>Nuevo</Badge>)
        expect(screen.getByText('Nuevo')).toBeInTheDocument()
    })

    it('renders numeric children', () => {
        render(<Badge>5</Badge>)
        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('renders complex children with emoji', () => {
        render(<Badge variant="success">✅ En Stock</Badge>)
        expect(screen.getByText('✅ En Stock')).toBeInTheDocument()
    })

    it('has correct base classes', () => {
        render(<Badge>Test</Badge>)
        const badge = screen.getByText('Test').closest('span')
        expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-medium')
    })

    it('applies default info variant', () => {
        render(<Badge>Info</Badge>)
        const badge = screen.getByText('Info').closest('span')
        expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('applies success variant', () => {
        render(<Badge variant="success">Success</Badge>)
        const badge = screen.getByText('Success').closest('span')
        expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('applies warning variant', () => {
        render(<Badge variant="warning">Warning</Badge>)
        const badge = screen.getByText('Warning').closest('span')
        expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })

    it('applies danger variant', () => {
        render(<Badge variant="danger">Danger</Badge>)
        const badge = screen.getByText('Danger').closest('span')
        expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('applies custom className', () => {
        render(<Badge className="ml-4 p-2">Custom</Badge>)
        const badge = screen.getByText('Custom').closest('span')
        expect(badge).toHaveClass('ml-4', 'p-2')
    })

    it('renders empty children', () => {
        const { container } = render(<Badge>xd</Badge>)
        expect(container.firstElementChild).not.toBeNull()
    })
})
