// src/components/Users/Users.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router'
import Users from './Users'

// Mock services
const mockUserService = {
    getAll: vi.fn(),
    delete: vi.fn()
}

vi.mock('~/services/api/userService', () => ({
    userService: mockUserService
}))

// Mock components
vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick} data-testid={`btn-${children?.toString().replace(/\s+/g, '-')}`}>
            {children}
        </button>
    )
}))

vi.mock('~/components/molecules/SearchBar', () => ({
    SearchBar: ({ value, onChange }: any) => (
        <input
            data-testid="search-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar por nombre o email..."
        />
    )
}))

vi.mock('~/components/atoms/Badge', () => ({
    Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}))

vi.mock('~/components/molecules/DeleteModal', () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="delete-modal" /> : null
}))

const mockUsers = [
    {
        id: 1,
        name: 'Ana Admin',
        email: 'ana@gamerzeta.cl',
        rol: 'admin'
    },
    {
        id: 2,
        name: 'Juan Pérez',
        email: 'juan@gamerzeta.cl',
        rol: 'cashier'
    }
]

const renderUsers = () => {
    return render(
        <MemoryRouter>
            <Users />
        </MemoryRouter>
    )
}

describe('Users', () => {
    const user = userEvent.setup()

    beforeEach(() => {
        vi.clearAllMocks()
        mockUserService.getAll.mockResolvedValue(mockUsers)
        Object.defineProperty(window, 'alert', { value: vi.fn() })
    })

    it('shows loading state initially', () => {
        mockUserService.getAll.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        renderUsers()
        expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument()
    })

    it('renders users table after loading', async () => {
        renderUsers()

        await waitFor(() => {
            expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument()
            expect(screen.getByText('Ana Admin')).toBeInTheDocument()
            expect(screen.getByText('ana@gamerzeta.cl')).toBeInTheDocument()
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })
    })

    it('filters users by search name and email', async () => {
        renderUsers()

        await waitFor(() => screen.getByText('Ana Admin'))

        await user.type(screen.getByTestId('search-input'), 'ana')
        await waitFor(() => {
            expect(screen.getByText('Ana Admin')).toBeInTheDocument()
            expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument()
        })
    })

    it('shows empty state when no users match search', async () => {
        renderUsers()

        await waitFor(() => screen.getByText('Ana Admin'))
        await user.type(screen.getByTestId('search-input'), 'xyz')

        await waitFor(() => {
            expect(screen.getByText('No se encontraron usuarios')).toBeInTheDocument()
        })
    })

    it('renders admin badge as success and cashier as info', async () => {
        renderUsers()

        await waitFor(() => screen.getByText('Ana Admin'))

        expect(screen.getAllByTestId('badge')[0]).toHaveTextContent('Administrador')
        expect(screen.getAllByTestId('badge')[1]).toHaveTextContent('Cajero')
    })

    it('navigates to create user', async () => {
        const mockNavigate = vi.fn()
        vi.doMock('react-router', () => ({
            useNavigate: () => mockNavigate
        }))

        renderUsers()
        await waitFor(() => screen.getByText('Gestión de Usuarios'))

        fireEvent.click(screen.getByTestId('btn-+ Nuevo Usuario'))
        expect(mockNavigate).toHaveBeenCalledWith('/admin/users/new')
    })

    it('opens delete modal on delete click', async () => {
        renderUsers()

        await waitFor(() => screen.getByText('Ana Admin'))
        fireEvent.click(screen.getAllByText('Eliminar')[0])

        await waitFor(() => {
            expect(screen.getByTestId('delete-modal')).toBeInTheDocument()
        })
    })

    it('deletes user successfully', async () => {
        mockUserService.delete.mockResolvedValue({})

        renderUsers()

        await waitFor(() => screen.getByText('Ana Admin'))
        fireEvent.click(screen.getAllByText('Eliminar')[0])

        await waitFor(() => screen.getByTestId('delete-modal'))

        // Simulate modal confirm (would need proper modal testing)
        mockUserService.delete.mockResolvedValue({})

        await waitFor(() => {
            expect(mockUserService.delete).toHaveBeenCalledWith(1)
        })
    })

    it('disables delete button for last admin', async () => {
        const onlyAdmin = [{ id: 1, name: 'Solo Admin', email: 'admin@gamerzeta.cl', rol: 'admin' }]
        mockUserService.getAll.mockResolvedValue(onlyAdmin)

        renderUsers()

        await waitFor(() => screen.getByText('Solo Admin'))
        const deleteBtn = screen.getAllByText('Eliminar')[0]
        expect(deleteBtn).toBeDisabled()
        expect(deleteBtn).toHaveAttribute('title', 'No puedes eliminar el último administrador')
    })
})
