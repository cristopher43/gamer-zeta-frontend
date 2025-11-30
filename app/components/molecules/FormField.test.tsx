// src/components/molecules/FormField/FormField.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormField } from './FormField'

// Mock Label + Input
vi.mock('~/components/atoms/Label', () => ({
    Label: ({ children, htmlFor, required }: any) => (
        <label htmlFor={htmlFor} data-required={required}>
            {children}
        </label>
    )
}))

vi.mock('~/components/atoms/Input', () => ({
    Input: ({ id, error, ...props }: any) => (
        <input
            id={id}
            data-error={error}
            aria-invalid={!!error}
            {...props}
        />
    )
}))

describe('FormField', () => {
    it('renders label and input correctly', () => {
        render(<FormField id="test" label="Nombre" />)
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre')).toHaveAttribute('id', 'test')
    })

    it('passes required prop to Label', () => {
        render(<FormField id="test" label="Email" required />)
        expect(screen.getByLabelText('Email')).toHaveAttribute('data-required', 'true')
    })

    it('does NOT show error message when no error', () => {
        render(<FormField id="test" label="Password" />)
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('shows error message when error provided', () => {
        render(<FormField
            id="test"
            label="Email"
            error="Email inválido"
        />)
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
        expect(screen.getByDisplayValue('')).toHaveAttribute('data-error', 'Email inválido')
        expect(screen.getByDisplayValue('')).toHaveAttribute('aria-invalid', 'true')
    })

    it('applies error styling to input', () => {
        render(<FormField
            id="test"
            label="Teléfono"
            error="Número inválido"
        />)
        const input = screen.getByLabelText('Teléfono')
        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(input).toHaveAttribute('data-error', 'Número inválido')
    })

    it('forwards all HTML input props', () => {
        render(<FormField
            id="test"
            label="Búsqueda"
            type="search"
            placeholder="Buscar productos..."
            value="mouse"
            autoComplete="off"
        />)
        const input = screen.getByLabelText('Búsqueda')
        expect(input).toHaveAttribute('type', 'search')
        expect(input).toHaveAttribute('placeholder', 'Buscar productos...')
        expect(input).toHaveValue('mouse')
        expect(input).toHaveAttribute('autocomplete', 'off')
    })

    it('applies correct spacing classes', () => {
        const { container } = render(<FormField id="test" label="Dirección" />)
        const fieldContainer = container.firstChild
        expect(fieldContainer).toHaveClass('mb-4')
    })

    it('renders multiple FormFields correctly', () => {
        render(
            <>
                <FormField id="name" label="Nombre" />
                <FormField id="email" label="Email" error="Requerido" />
            </>
        )
        expect(screen.getAllByRole('textbox')).toHaveLength(2)
        expect(screen.getByText('Requerido')).toBeInTheDocument()
    })
})
