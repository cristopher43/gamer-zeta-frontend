import React from 'react';

interface TextProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small';
    className?: string;
}

export const Text: React.FC<TextProps> = ({
                                              children,
                                              variant = 'body',
                                              className = ''
                                          }) => {
    const variantClasses = {
        h1: 'text-3xl font-bold text-gray-900',
        h2: 'text-2xl font-bold text-gray-800',
        h3: 'text-xl font-semibold text-gray-800',
        body: 'text-base text-gray-700',
        small: 'text-sm text-gray-600',
    };

    const Tag = variant.startsWith('h') ? variant : 'p';

    return (
        <Tag className={`${variantClasses[variant]} ${className}`}>
            {children}
        </Tag>
    );
};