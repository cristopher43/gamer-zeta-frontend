// src/components/atoms/Text/Text.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Text } from './Text'

describe('Text', () => {
    it('renders body variant by default', () => {
        render(<Text>Contenido normal</Text>)
        const text = screen.getByText('Contenido normal')
        expect(text.tagName).toBe('P')
        expect(text).toHaveClass('text-base', 'text-gray-700')
    })

    it('renders h1 variant with correct tag and classes', () => {
        render(<Text variant="h1">Título Principal</Text>)
        const heading = screen.getByText('Título Principal')
        expect(heading.tagName).toBe('H1')
        expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900')
    })

    it('renders h2 variant', () => {
        render(<Text variant="h2">Subtítulo</Text>)
        const heading = screen.getByText('Subtítulo')
        expect(heading.tagName).toBe('H2')
        expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-gray-800')
    })

    it('renders h3 variant', () => {
        render(<Text variant="h3">Título Secundario</Text>)
        const heading = screen.getByText('Título Secundario')
        expect(heading.tagName).toBe('H3')
        expect(heading).toHaveClass('text-xl', 'font-semibold', 'text-gray-800')
    })

    it('renders small variant', () => {
        render(<Text variant="small">Texto pequeño</Text>)
        const text = screen.getByText('Texto pequeño')
        expect(text.tagName).toBe('P')
        expect(text).toHaveClass('text-sm', 'text-gray-600')
    })

    it('applies custom className', () => {
        render(<Text className="text-blue-600 underline">Texto custom</Text>)
        const text = screen.getByText('Texto custom')
        expect(text).toHaveClass('text-blue-600', 'underline')
    })

    it('merges variant and custom classes', () => {
        render(<Text variant="h1" className="text-red-500 mb-4">Título custom</Text>)
        const heading = screen.getByText('Título custom')
        expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900', 'text-red-500', 'mb-4')
    })

    it('renders complex children', () => {
        render(
            <Text variant="body">
                Texto con <strong>negrita</strong> y <a href="#">enlace</a>
            </Text>
        )
        expect(screen.getByText('Texto con')).toBeInTheDocument()
        expect(screen.getByText('negrita')).toBeInTheDocument()
        expect(screen.getByText('enlace')).toBeInTheDocument()
    })
})
