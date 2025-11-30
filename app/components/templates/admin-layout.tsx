import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Button } from '~/components/atoms/Button';
import { Badge } from '~/components/atoms/Badge';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { useAuth } from '~/context/AuthContext';

interface NavItem {
    path: string;
    label: string;
    icon: string;
}

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems: NavItem[] = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/products', label: 'Productos', icon: '📦' },
        { path: '/admin/sales', label: 'Ventas', icon: '💰' },
        { path: '/admin/users', label: 'Usuarios', icon: '👥' },
    ];

    return (
        <ProtectedRoute requireAdmin>
            <div className="min-h-screen bg-gray-100">
                {/* Top Navbar */}
                <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-10">
                    <div className="px-4">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                                    🎮 Gamer Zeta
                                </span>
                                <Badge variant="success">
                                    ADMIN
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-sm text-right">
                                    <p className="font-medium text-gray-700">{user?.name}</p>
                                    <p className="text-gray-500 text-xs">Administrador</p>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="danger"
                                    size="sm"
                                >
                                    Cerrar Sesión
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="flex pt-16">
                    {/* Sidebar */}
                    <aside className="w-64 bg-white shadow-md fixed left-0 top-16 bottom-0 overflow-y-auto">
                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 ml-64 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}