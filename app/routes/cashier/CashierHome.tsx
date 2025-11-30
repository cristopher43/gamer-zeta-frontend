import React, { useState, useEffect } from 'react';
import { ShoppingCart } from '~/components/organisms/ShoppingCart';
import { AlertMessage } from '~/components/molecules/AlertMessage';
import { BoletaOrganism } from '~/components/organisms/BoletaOrganism';
import { productosService } from '~/services/api/productosService';
import { ventasService } from '~/services/api/ventasService';
import { useAuth } from '~/context/AuthContext';

interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    stock: number;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    activo?: boolean;
    imagen?: string;
}

const CashierHome: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Producto[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ ESTADOS BOLETA
    const [showBoletaModal, setShowBoletaModal] = useState(false);
    const [boletaData, setBoletaData] = useState<any>(null);

    // Modal pago
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
    const [cliente, setCliente] = useState('');
    const [rut, setRut] = useState('');

    useEffect(() => {
        console.log('🎯 AuthContext DEBUG:', { user, hasUser: !!user, userId: user?.id });
    }, [user]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productosService.getAll();
            setProducts(data.filter(p => p.activo !== false));
        } catch (error) {
            console.error('Error cargando productos:', error);
            setErrorMessage('Error al cargar productos');
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (productId: number, cantidad: number = 1) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cartItems.find(item => item.id === productId);
        const currentQuantity = existingItem ? existingItem.cantidad : 0;

        if (currentQuantity + cantidad > product.stock) {
            setErrorMessage(`Stock insuficiente. Solo hay ${product.stock} disponibles.`);
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === productId
                    ? { ...item, cantidad: item.cantidad + cantidad }
                    : item
            ));
        } else {
            setCartItems([...cartItems, {
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                cantidad,
                stock: product.stock,
            }]);
        }

        const qtyInput = document.getElementById(`qty-${productId}`) as HTMLInputElement;
        if (qtyInput) qtyInput.value = '1';
    };

    const handleUpdateQuantity = (id: number, cantidad: number) => {
        if (cantidad <= 0) {
            handleRemoveItem(id);
            return;
        }

        const item = cartItems.find(i => i.id === id);
        if (item && cantidad > item.stock) {
            setErrorMessage(`Stock insuficiente. Solo hay ${item.stock} unidades disponibles.`);
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, cantidad } : item
        ));
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleOpenPaymentModal = () => {
        if (cartItems.length === 0) {
            setErrorMessage('El carrito está vacío');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        setShowPaymentModal(true);
    };

    // ✅ FIXED: handleCheckout con cartCopy
    const handleCheckout = async () => {
        let usuarioIdFinal: number;
        if (user?.id && Number(user.id) > 0 && !isNaN(Number(user.id))) {
            usuarioIdFinal = Number(user.id);
            console.log('✅ Usando user.id real:', usuarioIdFinal);
        } else {
            usuarioIdFinal = 2;
            console.warn('⚠️ Fallback ID:', usuarioIdFinal);
        }

        setIsProcessing(true);

        try {
            const ventaData = {
                usuarioId: usuarioIdFinal,
                metodoPago,
                detalleProductos: cartItems.map(item => ({
                    productoId: item.id,
                    cantidad: item.cantidad,
                })),
                ...(cliente && { cliente }),
                ...(rut && { rut }),
            };

            console.log('📤 Enviando:', ventaData);

            const resultado = await ventasService.create(ventaData);
            console.log('✅ VENTA COMPLETA:', resultado);

            // ✅ CRITICAL FIX: Guardar copia ANTES de limpiar
            const cartCopy = [...cartItems];

            setBoletaData({
                resultado,
                cartItems: cartCopy,
                cliente: cliente || 'CONSUMIDOR FINAL',
                metodoPago,
                cajero: user?.name || 'Cajero Zeta'
            });
            setShowBoletaModal(true);

            // ✅ LIMPIAR DESPUÉS
            setCartItems([]);
            setCliente('');
            setRut('');
            setMetodoPago('Efectivo');
            setShowPaymentModal(false);
            setShowSuccess(true);
            await loadProducts();
            setTimeout(() => setShowSuccess(false), 3000);

        } catch (error: any) {
            console.error('❌ Error:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || 'Error procesando venta');
            setShowError(true);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Cargando productos...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">Punto de Venta</h1>

            {showSuccess && (
                <div className="mb-8">
                    <AlertMessage
                        type="success"
                        message="¡Venta realizada exitosamente!"
                        onClose={() => setShowSuccess(false)}
                    />
                </div>
            )}

            {showError && (
                <div className="mb-8">
                    <AlertMessage
                        type="error"
                        message={errorMessage}
                        onClose={() => setShowError(false)}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold mb-6">Productos Disponibles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2">
                                <div className="mb-6">
                                    <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={product.imagen || `https://picsum.photos/300/300?random=${product.id}`}
                                            alt={product.nombre}
                                            className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://picsum.photos/300/300?random=${product.id}`;
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-bold text-xl text-gray-900 leading-tight">{product.nombre}</h3>
                                    <p className="text-3xl font-bold text-blue-600">${product.precio.toLocaleString()}</p>
                                    <p className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        Stock: {product.stock.toLocaleString()}
                                    </p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            id={`qty-${product.id}`}
                                            min="1"
                                            max={product.stock}
                                            defaultValue="1"
                                            className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-center text-xl font-bold"
                                        />
                                        <button
                                            onClick={() => {
                                                const qtyInput = document.getElementById(`qty-${product.id}`) as HTMLInputElement;
                                                const cantidad = parseInt(qtyInput.value) || 1;
                                                handleAddToCart(product.id, cantidad);
                                            }}
                                            disabled={product.stock === 0}
                                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-lg font-bold hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all group-hover:scale-105"
                                        >
                                            ➕ Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <ShoppingCart
                        items={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        onCheckout={handleOpenPaymentModal}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>

            {/* ✅ BOLETA MODAL - FIXED */}
            {showBoletaModal && boletaData && (
                <BoletaOrganism
                    boleta={boletaData.resultado?.boleta || boletaData.resultado || boletaData}
                    venta={boletaData.resultado?.venta || boletaData.resultado || { subtotal: 0, iva: 0, total: 0 }}
                    cartItems={boletaData.cartItems || []}
                    metodoPago={boletaData.metodoPago || metodoPago}
                    cajero={boletaData.cajero || user?.name || 'Cajero Zeta'}
                    onPrint={() => window.print()}
                    onClose={() => {
                        setShowBoletaModal(false);
                        setBoletaData(null);
                    }}
                />
            )}

            {/* Modal Pago */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Finalizar Venta</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Método de Pago *</label>
                                <select
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value as any)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                                >
                                    <option value="Efectivo">💵 Efectivo</option>
                                    <option value="Tarjeta">💳 Tarjeta</option>
                                    <option value="Transferencia">📱 Transferencia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Nombre Cliente (Opcional)</label>
                                <input
                                    type="text"
                                    value={cliente}
                                    onChange={(e) => setCliente(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">RUT (Opcional)</label>
                                <input
                                    type="text"
                                    value={rut}
                                    onChange={(e) => setRut(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                                    placeholder="12.345.678-9"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8 pt-6 border-t">
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all"
                            >
                                {isProcessing ? '⏳ Procesando...' : '✅ Confirmar Venta'}
                            </button>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                disabled={isProcessing}
                                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-xl text-lg font-semibold hover:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashierHome;
