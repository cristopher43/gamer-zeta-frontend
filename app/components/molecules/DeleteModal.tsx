import React from 'react';
import { Button } from '~/components/atoms/Button';

interface DeleteModalProps {
    isOpen: boolean;
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
                                                     isOpen,
                                                     productName,
                                                     onConfirm,
                                                     onCancel
                                                 }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    {/* Icono de advertencia */}
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>

                    {/* Contenido */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Eliminar Producto
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            ¿Estás seguro que deseas eliminar el producto{' '}
                            <span className="font-semibold text-gray-900">"{productName}"</span>?
                            Esta acción no se puede deshacer.
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={onCancel}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={onConfirm}
                            className="flex-1"
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;