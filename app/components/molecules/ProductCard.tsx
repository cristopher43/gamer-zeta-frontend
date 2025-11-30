import React from 'react';
import { Button } from '~/components/atoms/Button';
import { Badge } from '~/components/atoms/Badge';
import { Image } from '~/components/atoms/Image';

interface ProductCardProps {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    imagen?: string;
    onAddToCart: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            id,
                                                            nombre,
                                                            precio,
                                                            stock,
                                                            imagen,
                                                            onAddToCart,
                                                        }) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="aspect-square bg-gray-200 rounded mb-3 overflow-hidden">
                {imagen ? (
                    <Image
                        src={imagen}
                        alt={nombre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                        🎮
                    </div>
                )}
            </div>

            <h3 className="font-semibold text-lg mb-1 truncate" title={nombre}>
                {nombre}
            </h3>

            <p className="text-2xl font-bold text-blue-600 mb-2">
                ${precio.toLocaleString('es-CL')}
            </p>

            <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">
          Stock: {stock}
        </span>
                {stock <= 5 && stock > 0 && (
                    <Badge variant="warning">
                        Poco stock
                    </Badge>
                )}
                {stock === 0 && (
                    <Badge variant="danger">
                        Agotado
                    </Badge>
                )}
            </div>

            <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onAddToCart(id)}
                disabled={stock === 0}
            >
                {stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </Button>
        </div>
    );
};
