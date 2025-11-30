import React, { useState } from 'react';
import { FormField } from '~/components/molecules/FormField';
import { Button } from '~/components/atoms/Button';
import { AlertMessage } from '~/components/molecules/AlertMessage';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onSubmit(email, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Iniciar Sesión
            </h2>

            {error && (
                <div className="mb-4">
                    <AlertMessage type="error" message={error} onClose={() => setError('')} />
                </div>
            )}

            <FormField
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="correo@ejemplo.com"
            />

            <FormField
                label="Contraseña"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
            />

            <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
            >
                Ingresar
            </Button>
        </form>
    );
};