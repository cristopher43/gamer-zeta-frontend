import React, { useState } from 'react';
import { ProductCard } from '~/components/molecules/ProductCard';
import { SearchBar } from '~/components/molecules/SearchBar';
import { Spinner } from '~/components/atoms/Spinner';

interface Product {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    imagen?: string;
    categoria: string;
}

interface ProductListProps {
    products: Product[];
    onAddToCart: (id: number) => void;
    isLoading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
                                                            products,
                                                            onAddToCart,
                                                            isLoading = false
                                                        }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar productos por nombre o categoría..."
                />
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No se encontraron productos
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
