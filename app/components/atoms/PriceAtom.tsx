import React from 'react';

interface PriceProps {
    amount: number;
    className?: string;
}

export const PriceAtom: React.FC<PriceProps> = ({ amount, className = '' }) => (  // ✅ PriceAtom NO PriceProps
    <span className={`font-mono font-bold ${className}`}>
        ${amount.toLocaleString('es-CL')}
    </span>
);
