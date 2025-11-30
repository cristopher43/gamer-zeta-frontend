// src/components/atoms/Spinner/Spinner.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
    it('renders spinner container', () => {
        render(<Spinner />)
        const container = screen.getByRole('status')?.closest('div')
        expect(container).not.toBeNull()
    })

    it('applies default md size classes', () => {
        render(<Spinner />)
        const container = screen.getByRole('status')?.closest('div')
        expect(container).toHaveClass('w-8', 'h-8')
    })

    it('applies sm size classes', () => {
        render(<Spinner size="sm" />)
        const container = screen.getByRole('status')?.closest('div')
        expect(container).toHaveClass('w-4', 'h-4')
    })

    it('applies lg size classes', () => {
        render(<Spinner size="lg" />)
        const container = screen.getByRole('status')?.closest('div')
        expect(container).toHaveClass('w-12', 'h-12')
    })

    it('renders spinning inner div with correct classes', () => {
        render(<Spinner />)
        const spinnerDiv = screen.getByRole('status')
        expect(spinnerDiv).toHaveClass(
            'animate-spin',
            'rounded-full',
            'border-4',
            'border-gray-200',
            'border-t-blue-600'
        )
    })

    it('applies custom className to container', () => {
        render(<Spinner className="mr-2" />)
        const container = screen.getByRole('status')?.closest('div')
        expect(container).toHaveClass('mr-2', 'inline-block')
    })

    it('merges size and custom classes', () => {
        render(<Spinner size="lg" className="mr-4 p-2" />)
        const container = screen.getByRole('status')?.closest('div')
        expect(container).toHaveClass('w-12', 'h-12', 'mr-4', 'p-2')
    })

    it('has correct accessibility role', () => {
        render(<Spinner aria-label="Loading spinner" />)
        const spinner = screen.getByRole('status', { name: /loading spinner/i })
        expect(spinner).toBeInTheDocument()
    })
})
