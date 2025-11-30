import React from 'react';
import { Input } from '~/components/atoms/Input';
import { Icon } from '~/components/atoms/Icon';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        value,
                                                        onChange,
                                                        placeholder = 'Buscar...'
                                                    }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="🔍" size="sm" className="text-gray-400" />
            </div>
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-10"
            />
        </div>
    );
};