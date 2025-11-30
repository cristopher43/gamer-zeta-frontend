import React from 'react';
import { Icon } from '~/components/atoms/Icon';
import { Text } from '~/components/atoms/Text';

interface StatCardProps {
    icon: string;
    label: string;
    value: string | number;
    variant?: 'blue' | 'green' | 'yellow' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
                                                      icon,
                                                      label,
                                                      value,
                                                      variant = 'blue'
                                                  }) => {
    const variantClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center justify-between">
                <div>
                    <Text variant="small" className="text-gray-500 mb-1">
                        {label}
                    </Text>
                    <Text variant="h2" className="text-gray-900">
                        {value}
                    </Text>
                </div>
                <div className={`p-4 rounded-full ${variantClasses[variant]}`}>
                    <Icon name={icon} size="lg" />
                </div>
            </div>
        </div>
    );
};
