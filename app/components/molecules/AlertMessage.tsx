import React from 'react';

interface AlertMessageProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    message: string;
    onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
                                                              type = 'info',
                                                              message,
                                                              onClose
                                                          }) => {
    const typeClasses = {
        info: 'bg-blue-100 border-blue-400 text-blue-700',
        success: 'bg-green-100 border-green-400 text-green-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        error: 'bg-red-100 border-red-400 text-red-700',
    };

    const icons = {
        info: 'ℹ️',
        success: '✓',
        warning: '⚠️',
        error: '✕',
    };

    return (
        <div className={`border px-4 py-3 rounded relative ${typeClasses[type]}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span>{icons[type]}</span>
                    <span>{message}</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-4 font-bold text-xl"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};
