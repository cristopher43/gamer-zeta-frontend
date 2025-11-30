import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
// @ts-ignore
import type { Route } from './+types/login';
import { LoginForm } from '~/components/organisms/LoginForm';
import { useAuth } from '~/context/AuthContext';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Login - Gamer Zeta' },
        { name: 'description', content: 'Inicia sesión en el sistema POS' },
    ];
}

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated, isAdmin } = useAuth();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/cashier');
            }
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError('');

            await login({ email, password });

            // El useEffect manejará la redirección
        } catch (err: any) {
            console.error('Error en login:', err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError('Email o contraseña incorrectos');
            } else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                setError('No se puede conectar con el servidor. Verifica que el backend esté corriendo.');
            } else {
                setError('Error al iniciar sesión. Intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <div className="flex items-center">
                            <span className="mr-2">⚠️</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <LoginForm onSubmit={handleLogin} />

                {loading && (
                    <div className="text-center mt-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="text-gray-600 mt-2">Iniciando sesión...</p>
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                        🔐 Credenciales de prueba:
                    </p>
                    <div className="text-sm text-blue-800">
                        <p><strong>Admin:</strong></p>
                        <p className="ml-4">Email: admin@gamer.com</p>
                        <p className="ml-4">Password: admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}