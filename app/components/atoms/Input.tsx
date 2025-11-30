import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input: React.FC<InputProps> = ({
                                                error,
                                                className = '',
                                                ...props
                                            }) => {
    const baseClasses = 'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2';
    const errorClasses = error
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-blue-500';

    return (
        <input
            className={`${baseClasses} ${errorClasses} ${className}`}
            {...props}
        />
    );
};