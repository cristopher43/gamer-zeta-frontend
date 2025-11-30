// src/components/molecules/AlertMessage/AlertMessage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AlertMessage } from './AlertMessage'

describe('AlertMessage', () => {
    it('renders message with correct icon for info type', () => {
        render(<AlertMessage type="info" message="Información importante" />)
        expect(screen.getByText('ℹ️')).toBeInTheDocument()
        expect(screen.getByText('Información importante')).toBeInTheDocument()
    })

    it('renders different types with correct icons', () => {
        const types = [
            { type: 'success', icon: '✓' },
            { type: 'warning', icon: '⚠️' },
            { type: 'error', icon: '✕' }
        ]

        types.forEach(({ type, icon }) => {
            render(<AlertMessage type={type as any} message="Test" />)
            expect(screen.getByText(icon)).toBeInTheDocument()
        })
    })

    it('applies correct classes for each type', () => {
        render(<AlertMessage type="success" message="Success" />)
        const alertDiv = screen.getByText('✓').closest('div')
        expect(alertDiv).toHaveClass('bg-green-100', 'border-green-400', 'text-green-700')
    })

    it('shows close button when onClose provided', () => {
        const onClose = vi.fn()
        render(<AlertMessage type="error" message="Error" onClose={onClose} />)
        expect(screen.getByText('×')).toBeInTheDocument()
    })

    it('does NOT show close button when onClose NOT provided', () => {
        render(<AlertMessage type="info" message="No close" />)
        expect(screen.queryByText('×')).not.toBeInTheDocument()
    })

    it('calls onClose when close button clicked', () => {
        const onClose = vi.fn()
        render(<AlertMessage type="warning" message="Close me" onClose={onClose} />)
        fireEvent.click(screen.getByText('×'))
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('has correct layout structure', () => {
        render(<AlertMessage type="info" message="Test message" onClose={vi.fn()} />)
        expect(screen.getByText('ℹ️')).toBeInTheDocument()
        expect(screen.getByText('Test message')).toBeInTheDocument()
        expect(screen.getByText('×')).toBeInTheDocument()
    })
})
