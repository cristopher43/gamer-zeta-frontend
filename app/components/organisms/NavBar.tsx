import React from 'react';
import { Link } from 'react-router';
import { Button } from '~/components/atoms/Button';
import { UserBadge } from '~/components/molecules/UserBadge';

interface NavbarProps {
    userName: string;
    userRole: 'admin' | 'cashier';
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, userRole, onLogout }) => {
    // @ts-ignore
    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        🎮 Gamer Zeta
                    </Link>

                    <div className="flex items-center gap-4">
                        <UserBadge nombre={userName} rol={userRole} />
                        <Button
                            onClick={onLogout}
                            variant="danger"
                            size="sm"
                        >
                            Salir
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};