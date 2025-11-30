// src/components/atoms/Icon/Icon.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Icon } from './Icon'

describe('Icon', () => {
    it('renders icon name as text', () => {
        render(<Icon name="cart" />)
        expect(screen.getByText('cart')).toBeInTheDocument()
    })

    it('applies default md size class', () => {
        render(<Icon name="home" />)
        const iconSpan = screen.getByText('home').parentElement
        expect(iconSpan).toHaveClass('text-xl')
    })

    it('applies sm size class', () => {
        render(<Icon name="user" size="sm" />)
        const iconSpan = screen.getByText('user').parentElement
        expect(iconSpan).toHaveClass('text-sm')
    })

    it('applies lg size class', () => {
        render(<Icon name="settings" size="lg" />)
        const iconSpan = screen.getByText('settings').parentElement
        expect(iconSpan).toHaveClass('text-3xl')
    })

    it('applies custom className', () => {
        render(<Icon name="star" className="ml-2 text-red-500" />)
        const iconSpan = screen.getByText('star').parentElement
        expect(iconSpan).toHaveClass('ml-2', 'text-red-500')
    })

    it('merges size and custom classes', () => {
        render(<Icon name="heart" size="lg" className="animate-pulse" />)
        const iconSpan = screen.getByText('heart').parentElement
        expect(iconSpan).toHaveClass('text-3xl', 'animate-pulse')
    })
})
