// src/components/UserForm/UserForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router'
import UserForm from './UserForm'

// Mock services
const mockUserService = {
    getOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
}

vi.mock('~/services/api/userService', () => ({
    userService: mockUserService
}))

// Mock Button
vi.mock('~/components/atoms/Button', () => ({
    Button: ({ children, type, disabled }: any) => (
        <button data-testid={`btn-${type}`} disabled={disabled}>
            {children}
        </button>
    )
}))

// Test wrapper with routes
const TestUserForm = ({ userId }: { userId?: string }) => (
    <MemoryRouter initialEntries={[`/admin/users/${userId || ''}`]}>
        <Routes>
            <Route path="/admin/users/:id?" element={<UserForm />} />
            <Route path="/admin/users" element={<div>Users List</div>} />
        </Routes>
    </MemoryRouter>
)

describe('UserForm', () => {
    const user = userEvent.setup()

    beforeEach(() => {
        vi.clearAllMocks()
        Object.defineProperty(window, 'alert', { value: vi.fn() })
    })

    it('renders create form title and default values', () => {
        render(<TestUserForm />)
        expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument()
        expect(screen.getByDisplayValue('cashier')).toBeInTheDocument()
    })

    it('renders edit form title after loading user', async () => {
        mockUserService.getOne.mockResolvedValue({
            id: 1,
            name: 'Ana Admin',
            email: 'ana@gamerzeta.cl',
            rol: 'admin'
        })

        render(<TestUserForm userId="1" />)

        await waitFor(() => {
            expect(screen.getByText('Editar Usuario')).toBeInTheDocument()
            expect(screen.getByDisplayValue('Ana Admin')).toBeInTheDocument()
            expect(screen.getByDisplayValue('ana@gamerzeta.cl')).toBeInTheDocument()
        })
    })

    it('validates name field', async () => {
        render(<TestUserForm />)

        fireEvent.click(screen.getByTestId('btn-submit'))
        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()

        await user.type(screen.getByLabelText(/Nombre Completo/), 'A')
        fireEvent.click(screen.getByTestId('btn-submit'))
        expect(screen.getByText('El nombre debe tener al menos 3 caracteres')).toBeInTheDocument()
    })

    it('validates email field', async () => {
        render(<TestUserForm />)

        await user.type(screen.getByLabelText(/Nombre Completo/), 'Juan Pérez')
        await user.type(screen.getByLabelText(/Email/), 'invalid-email')
        fireEvent.click(screen.getByTestId('btn-submit'))

        expect(screen.getByText('El email no es válido')).toBeInTheDocument()
    })

    it('validates password confirmation (create mode)', async () => {
        render(<TestUserForm />)

        await user.type(screen.getByLabelText(/Nombre Completo/), 'Juan Pérez')
        await user.type(screen.getByLabelText(/Email/), 'juan@gamerzeta.cl')
        await user.type(screen.getByLabelText(/Rol/), 'admin')
        await user.type(screen.getByLabelText(/Contraseña/), '12345')
        await user.type(screen.getByLabelText(/Confirmar Contraseña/), '123456')

        fireEvent.click(screen.getByTestId('btn-submit'))

        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
    })

    it('skips password validation in edit mode when empty', async () => {
        mockUserService.getOne.mockResolvedValue({
            id: 1,
            name: 'Ana Admin',
            email: 'ana@gamerzeta.cl',
            rol: 'admin'
        })

        render(<TestUserForm userId="1" />)

        await waitFor(() => screen.getByDisplayValue('Ana Admin'))

        fireEvent.click(screen.getByTestId('btn-submit'))
        await waitFor(() => {
            expect(screen.queryByText(/contraseña/i)).not.toBeInTheDocument()
        })
    })

    it('submits create form successfully', async () => {
        mockUserService.create.mockResolvedValue({ id: 1 })

        render(<TestUserForm />)

        await user.type(screen.getByLabelText(/Nombre Completo/), 'Juan Pérez')
        await user.type(screen.getByLabelText(/Email/), 'juan@gamerzeta.cl')
        await user.selectOptions(screen.getByLabelText(/Rol/), 'admin')
        await user.type(screen.getByLabelText(/Contraseña/), 'password123')
        await user.type(screen.getByLabelText(/Confirmar Contraseña/), 'password123')

        fireEvent.click(screen.getByTestId('btn-submit'))

        await waitFor(() => {
            expect(mockUserService.create).toHaveBeenCalledWith({
                name: 'Juan Pérez',
                email: 'juan@gamerzeta.cl',
                password: 'password123',
                rol: 'admin'
            })
        })
    })

    it('shows submit error', async () => {
        mockUserService.create.mockRejectedValue({ response: { data: { message: 'Email ya existe' } } })

        render(<TestUserForm />)

        fireEvent.click(screen.getByTestId('btn-submit'))

        await waitFor(() => {
            expect(screen.getByText('Email ya existe')).toBeInTheDocument()
        })
    })

    it('shows role description text', async () => {
        render(<TestUserForm />)

        expect(screen.getByText('Acceso limitado a ventas y consultas')).toBeInTheDocument()

        await user.selectOptions(screen.getByLabelText(/Rol/), 'admin')
        expect(screen.getByText('Acceso completo al sistema')).toBeInTheDocument()
    })
})
