// @ts-ignore
import React from 'react';
// @ts-ignore
import { Link, useLocation } from 'react-router';

interface SidebarItem {
    path: string;
    label: string;
    icon: string;
}

interface SidebarProps {
    items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-white shadow-md fixed left-0 top-16 bottom-0 overflow-y-auto">
            <nav className="p-4 space-y-2">
                {items.map((item) => {
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
    );
};