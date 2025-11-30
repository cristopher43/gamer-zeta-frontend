import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Button } from '~/components/atoms/Button';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { useAuth } from '~/context/AuthContext';

export default function CashierLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Navbar */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-8">
                                <Link to="/cashier" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                                    🎮 Gamer Zeta
                                </Link>

                                <div className="flex gap-4">
                                    <Link
                                        to="/cashier"
                                        className={`px-3 py-2 rounded-md font-medium transition-colors ${
                                            location.pathname === '/cashier'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                    >
                                        Punto de Venta
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">{user?.name}</p>
                                    <p className="text-gray-500 text-xs">Cajero</p>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="danger"
                                    size="sm"
                                >
                                    Salir
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <main className="max-w-7xl mx-auto px-4 py-6">
                    <Outlet />
                </main>
            </div>
        </ProtectedRoute>
    );
}
