import React from 'react';

interface IconProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Icon: React.FC<IconProps> = ({
                                              name,
                                              size = 'md',
                                              className = ''
                                          }) => {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-3xl',
    };

    return (
        <span className={`${sizeClasses[size]} ${className}`}>
      {name}
    </span>
    );
};