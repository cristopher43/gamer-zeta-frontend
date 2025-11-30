import React from 'react';
import { Button } from '~/components/atoms/Button';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
                                                                      value,
                                                                      onChange,
                                                                      min = 1,
                                                                      max = 99
                                                                  }) => {
    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="secondary"
                size="sm"
                onClick={handleDecrement}
                disabled={value <= min}
            >
                -
            </Button>
            <input
                type="number"
                value={value}
                onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    if (newValue >= min && newValue <= max) {
                        onChange(newValue);
                    }
                }}
                className="w-16 text-center border rounded px-2 py-1"
                min={min}
                max={max}
            />
            <Button
                variant="secondary"
                size="sm"
                onClick={handleIncrement}
                disabled={value >= max}
            >
                +
            </Button>
        </div>
    );
};