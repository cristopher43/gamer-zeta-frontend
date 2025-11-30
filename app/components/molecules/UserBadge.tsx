import React from 'react';
import { Badge } from '~/components/atoms/Badge';

interface UserBadgeProps {
    nombre: string;
    rol: 'admin' | 'cashier';
}

export const UserBadge: React.FC<UserBadgeProps> = ({ nombre, rol }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {nombre.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="font-medium text-gray-700">{nombre}</p>
                <Badge variant={rol === 'admin' ? 'success' : 'info'}>
                    {rol === 'admin' ? 'Administrador' : 'Cajero'}
                </Badge>
            </div>
        </div>
    );
};