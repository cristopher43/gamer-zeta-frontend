// src/components/atoms/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
    it('renders button with children', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('applies primary variant by default', () => {
        render(<Button>Primary</Button>)
        const button = screen.getByRole('button', { name: /primary/i })
        expect(button).toHaveClass('bg-blue-600', 'text-white')
    })

    it('applies different variants', () => {
        const variants = [
            { variant: 'primary', bg: 'bg-blue-600' },
            { variant: 'secondary', bg: 'bg-gray-200' },
            { variant: 'danger', bg: 'bg-red-600' },
            { variant: 'success', bg: 'bg-green-600' }
        ]

        variants.forEach(({ variant, bg }) => {
            render(<Button variant={variant as any}>Test</Button>)
            const button = screen.getByRole('button', { name: /test/i })
            expect(button).toHaveClass(bg)
        })
    })

    it('applies different sizes', () => {
        render(<Button size="lg">Large</Button>)
        const button = screen.getByRole('button', { name: /large/i })
        expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    })

    it('shows loading state when isLoading=true', () => {
        render(<Button isLoading>Loading Button</Button>)
        expect(screen.getByRole('button', { name: /cargando.../i })).toBeInTheDocument()
        expect(screen.queryByText('Loading Button')).not.toBeInTheDocument()
    })

    it('is disabled when isLoading=true', () => {
        render(<Button isLoading>Test</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('is disabled when disabled=true', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByRole('button', { name: /disabled/i })
        expect(button).toBeDisabled()
    })

    it('applies custom className', () => {
        render(<Button className="ml-4 shadow-lg">Custom</Button>)
        const button = screen.getByRole('button', { name: /custom/i })
        expect(button).toHaveClass('ml-4', 'shadow-lg')
    })

    it('handles click event', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click</Button>)
        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick} disabled>Disabled</Button>)
        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).not.toHaveBeenCalled()
    })
})
