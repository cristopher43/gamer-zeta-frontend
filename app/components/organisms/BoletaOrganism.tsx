import React from 'react';
import { CartItem } from '../molecules/CartItem';
import { BoletaHeaderAtom } from '../atoms/BoletaHeaderAtom';
import { BoletaTotalsMolecule } from '../molecules/BoletaTotalsMolecule';

interface BoletaProps {
    boleta: any;
    venta: any;
    // @ts-ignore
    cartItems: CartItem[];
    metodoPago: string;
    cajero: string;
    onClose: () => void;
    onPrint: () => void;
}

export const BoletaOrganism: React.FC<BoletaProps> = ({
                                                          boleta, venta, cartItems, metodoPago, cajero, onClose, onPrint
                                                      }) => {
    const fecha = new Date().toLocaleDateString('es-CL');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 print:bg-white print:inset-0 print:backdrop-blur-none">
            <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-y-auto print:max-w-none print:w-auto print:h-auto print:shadow-none print:rounded-none print:m-8">

                {/* CONTROLES */}
                <div className="sticky top-0 z-10 bg-white border-b print:hidden p-6 rounded-t-3xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-gray-900">Boleta Electrónica</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={onPrint}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-emerald-700 transition-all"
                            >
                                🖨️ Imprimir
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENIDO BOLETA */}
                <div className="p-8 print:p-12 max-w-4xl mx-auto">

                    {/* HEADER */}
                    <BoletaHeaderAtom numero={boleta.numero} fecha={fecha} />

                    {/* CLIENTE */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8 print:grid-cols-1">
                        <div className="bg-gray-50 p-6 rounded-2xl">
                            <h4 className="font-bold text-gray-700 mb-2">Cliente</h4>
                            <p className="text-xl font-semibold">{boleta.cliente || 'CONSUMIDOR FINAL'}</p>
                            {boleta.rut && <p className="text-sm text-gray-600 mt-1">RUT: {boleta.rut}</p>}
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl text-right print:text-left">
                            <h4 className="font-bold text-blue-700 mb-2">Datos Venta</h4>
                            <p><strong>Método:</strong> {metodoPago}</p>
                            <p><strong>Cajero:</strong> {cajero}</p>
                        </div>
                    </div>

                    {/* PRODUCTOS - USA TU CARTITEM */}
                    <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-3xl p-6 mb-8 shadow-inner print:bg-white print:shadow-none">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 text-center">DETALLE DE PRODUCTOS</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    id={item.id}
                                    nombre={item.nombre}
                                    precio={item.precio}
                                    cantidad={item.cantidad}
                                    onUpdateQuantity={() => {}} // Disabled en boleta
                                    onRemove={() => {}}          // Disabled en boleta
                                />
                            ))}
                        </div>
                    </div>

                    {/* TOTALES */}
                    <BoletaTotalsMolecule
                        subtotal={venta.subtotal || 0}
                        iva={venta.iva || 0}
                        total={venta.total || 0}
                    />

                    {/* PIE */}
                    <div className="text-center mt-12 pt-8 border-t-4 border-gray-200 print:border-dashed">
                        <p className="text-2xl font-black text-emerald-600 mb-4 tracking-wider">¡GRACIAS POR TU COMPRA!</p>
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 inline-block">
                            <p className="font-mono text-lg font-bold text-gray-800">
                                BOLETA ELECTRÓNICA {boleta.numero} • SII CERTIFICADO
                            </p>
                            <p className="text-xs text-gray-600 mt-2">Guarde este comprobante</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
