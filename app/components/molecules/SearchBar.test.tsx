// src/components/molecules/SearchBar/SearchBar.test.tsx
// @ts-ignore
import { render, screen, fireEvent, userEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SearchBar } from './SearchBar'

// Mock Input + Icon
vi.mock('~/components/atoms/Input', () => ({
    Input: ({ value, onChange, placeholder, className }: any) => (
        <input
            data-testid="search-input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
        />
    )
}))

vi.mock('~/components/atoms/Icon', () => ({
    Icon: ({ name, className }: any) => (
        <span data-testid="search-icon" className={className}>
      {name}
    </span>
    )
}))

describe('SearchBar', () => {
    const defaultProps = {
        value: '',
        onChange: vi.fn(),
        placeholder: 'Buscar productos...'
    }

    it('renders search icon correctly', () => {
        render(<SearchBar {...defaultProps} />)
        expect(screen.getByTestId('search-icon')).toHaveTextContent('🔍')
        expect(screen.getByTestId('search-icon')).toHaveClass('text-gray-400')
    })

    it('renders input with correct value and placeholder', () => {
        render(<SearchBar {...defaultProps} />)
        const input = screen.getByTestId('search-input')
        expect(input).toHaveValue('')
        expect(input).toHaveAttribute('placeholder', 'Buscar productos...')
        expect(input).toHaveAttribute('type', 'text')
    })

    it('calls onChange when typing', async () => {
        const user = userEvent.setup()
        render(<SearchBar {...defaultProps} />)

        await user.type(screen.getByTestId('search-input'), 'mouse')
        expect(defaultProps.onChange).toHaveBeenCalledWith('mouse')
    })

    it('applies pl-10 padding for icon space', () => {
        render(<SearchBar {...defaultProps} />)
        const input = screen.getByTestId('search-input')
        expect(input).toHaveClass('pl-10')
    })

    it('uses custom placeholder', () => {
        render(<SearchBar {...defaultProps} placeholder="Buscar clientes..." />)
        expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Buscar clientes...')
    })

    it('handles initial value correctly', () => {
        render(<SearchBar value="teclado" onChange={defaultProps.onChange} />)
        expect(screen.getByTestId('search-input')).toHaveValue('teclado')
    })

    it('positions icon absolutely left', () => {
        const { container } = render(<SearchBar {...defaultProps} />)
        const iconContainer = screen.getByTestId('search-icon').parentElement
        expect(iconContainer).toHaveClass('absolute', 'inset-y-0', 'left-0', 'pl-3', 'flex', 'items-center', 'pointer-events-none')
    })

    it('clears search with empty string', async () => {
        const user = userEvent.setup()
        render(<SearchBar value="monitor" onChange={defaultProps.onChange} />)

        await user.clear(screen.getByTestId('search-input'))
        expect(defaultProps.onChange).toHaveBeenCalledWith('')
    })
})
