import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/atoms/Button';
import { Badge } from '~/components/atoms/Badge';
import { SearchBar } from '~/components/molecules/SearchBar';
import DeleteModal from '~/components/molecules/DeleteModal';
import { userService, type UserResponse } from '~/services/api/userService';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: UserResponse | null }>({
        isOpen: false,
        user: null
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            alert('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        navigate('/admin/users/new');
    };

    const handleEdit = (userId: number) => {
        navigate(`/admin/users/edit/${userId}`);
    };

    const handleDeleteClick = (user: UserResponse) => {
        setDeleteModal({ isOpen: true, user });
    };

    const handleDeleteConfirm = async () => {
        if (deleteModal.user) {
            try {
                await userService.delete(deleteModal.user.id);
                setUsers(prev => prev.filter(u => u.id !== deleteModal.user!.id));
                setDeleteModal({ isOpen: false, user: null });
                alert('Usuario eliminado exitosamente');
            } catch (error) {
                console.error('Error eliminando usuario:', error);
                alert('Error al eliminar el usuario');
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, user: null });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando usuarios...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <Button variant="primary" onClick={handleCreate}>
                    + Nuevo Usuario
                </Button>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar por nombre o email..."
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Acciones
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={user.rol === 'admin' ? 'success' : 'info'}>
                                        {user.rol === 'admin' ? 'Administrador' : 'Cajero'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleEdit(user.id)}
                                        className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                        disabled={user.rol === 'admin' && users.filter(u => u.rol === 'admin').length === 1}
                                        title={
                                            user.rol === 'admin' && users.filter(u => u.rol === 'admin').length === 1
                                                ? 'No puedes eliminar el último administrador'
                                                : ''
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No se encontraron usuarios
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                productName={deleteModal.user?.name || ''}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default Users;