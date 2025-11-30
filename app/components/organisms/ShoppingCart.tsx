import React from 'react';
import { CartItem } from '~/components/molecules/CartItem';
import { PriceDisplay } from '~/components/molecules/PriceDisplay';
import { Button } from '~/components/atoms/Button';
import { Divider } from '~/components/atoms/Divider';

interface CartItemType {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
}

interface ShoppingCartProps {
    items: CartItemType[];
    onUpdateQuantity: (id: number, cantidad: number) => void;
    onRemove: (id: number) => void;
    onCheckout: () => void;
    isProcessing?: boolean;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
                                                              items,
                                                              onUpdateQuantity,
                                                              onRemove,
                                                              onCheckout,
                                                              isProcessing = false,
                                                          }) => {
    const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Carrito</h2>

            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">🛒</p>
                    <p>El carrito está vacío</p>
                </div>
            ) : (
                <>
                    <div className="max-h-96 overflow-y-auto mb-4">
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                {...item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>

                    <Divider className="my-4" />

                    <div className="space-y-2">
                        <PriceDisplay label="Subtotal" amount={subtotal} />
                        <PriceDisplay label="IVA (19%)" amount={iva} />
                        <Divider className="my-2" />
                        <PriceDisplay label="Total" amount={total} emphasized />
                    </div>

                    <Button
                        variant="success"
                        size="lg"
                        className="w-full mt-6"
                        onClick={onCheckout}
                        isLoading={isProcessing}
                        disabled={items.length === 0}
                    >
                        Finalizar Venta
                    </Button>
                </>
            )}
        </div>
    );
};
