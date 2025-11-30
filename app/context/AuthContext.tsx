import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api/authService';
import type { LoginDto, UserProfile } from '../services/types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isCashier: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const profile = await authService.getProfile();
                setUser(profile);
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            authService.logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginDto) => {
        const response = await authService.login(credentials);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify({
            email: response.email,
            name: response.name,
            rol: response.rol,
        }));

        const profile = await authService.getProfile();
        setUser(profile);
    };

    const register = async (name: string, email: string, password: string) => {
        await authService.register({ name, email, password });
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.rol === 'admin',
                isCashier: user?.rol === 'cashier',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};