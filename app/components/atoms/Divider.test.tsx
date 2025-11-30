// src/components/atoms/Divider/Divider.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
    it('renders hr element', () => {
        const { container } = render(<Divider />)
        const hr = container.querySelector('hr')
        expect(hr).not.toBeNull()
        expect(hr?.tagName).toBe('HR')
    })

    it('applies default border-gray-200 class', () => {
        const { container } = render(<Divider />)
        const hr = container.querySelector('hr')
        expect(hr).toHaveClass('border-gray-200')
    })

    it('applies custom className', () => {
        const { container } = render(<Divider className="my-8 border-blue-500" />)
        const hr = container.querySelector('hr')
        expect(hr).toHaveClass('my-8', 'border-blue-500', 'border-gray-200')
    })

    it('merges classes correctly', () => {
        const { container } = render(<Divider className="border-red-500" />)
        const hr = container.querySelector('hr')
        expect(hr).toHaveClass('border-gray-200', 'border-red-500')
    })
})
