import React from 'react';

export interface CartItemProps {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    onUpdateQuantity: (id: number, cantidad: number) => void;
    onRemove: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
                                                      id,
                                                      nombre,
                                                      precio,
                                                      cantidad,
                                                      onUpdateQuantity,
                                                      onRemove,
                                                  }) => {
    return (
        <div className="flex items-center justify-between border-b py-3 last:border-b-0">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{nombre}</h4>
                <p className="text-sm text-gray-600">
                    ${precio.toLocaleString('es-CL')} c/u
                </p>
            </div>

            <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center border rounded">
                    <button
                        onClick={() => onUpdateQuantity(id, cantidad - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        disabled={cantidad <= 1}
                    >
                        -
                    </button>
                    <span className="px-4 py-1 border-x min-w-[3rem] text-center">
            {cantidad}
          </span>
                    <button
                        onClick={() => onUpdateQuantity(id, cantidad + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    >
                        +
                    </button>
                </div>

                <span className="font-semibold w-24 text-right text-gray-900">
          ${(precio * cantidad).toLocaleString('es-CL')}
        </span>

                <button
                    onClick={() => onRemove(id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1 text-xl"
                    title="Eliminar"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
