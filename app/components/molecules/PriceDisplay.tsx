import React from 'react';

interface PriceDisplayProps {
    label: string;
    amount: number;
    emphasized?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
                                                              label,
                                                              amount,
                                                              emphasized = false
                                                          }) => {
    return (
        <div className={`flex justify-between items-center ${emphasized ? 'font-bold text-lg' : ''}`}>
      <span className={emphasized ? 'text-gray-900' : 'text-gray-600'}>
        {label}
      </span>
            <span className={emphasized ? 'text-gray-900' : 'text-gray-700'}>
        ${amount.toLocaleString('es-CL')}
      </span>
        </div>
    );
};