// src/components/atoms/Label/Label.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from './Label'

describe('Label', () => {
    it('renders label with children', () => {
        render(<Label>Nombre Completo</Label>)
        expect(screen.getByText('Nombre Completo')).toBeInTheDocument()
    })

    it('applies default classes', () => {
        render(<Label>Default Label</Label>)
        const label = screen.getByText('Default Label').closest('label')
        expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')
    })

    it('shows required asterisk when required=true', () => {
        render(<Label required>Campo Requerido</Label>)
        expect(screen.getByText('Campo Requerido')).toBeInTheDocument()
        expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('does NOT show asterisk when required=false', () => {
        render(<Label required={false}>Opcional</Label>)
        expect(screen.getByText('Opcional')).toBeInTheDocument()
        expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(<Label className="text-lg text-blue-600">Custom Label</Label>)
        const label = screen.getByText('Custom Label').closest('label')
        expect(label).toHaveClass('text-lg', 'text-blue-600')
    })

    it('is semantic HTML label element', () => {
        render(<Label>Nombre</Label>)
        const label = screen.getByText('Nombre').closest('label')
        expect(label?.tagName).toBe('LABEL')
    })

    it('forwards HTML attributes', () => {
        render(<Label htmlFor="test-input" data-testid="label-test">Test</Label>)
        const label = screen.getByTestId('label-test')
        expect(label).toHaveAttribute('for', 'test-input')
    })
})
