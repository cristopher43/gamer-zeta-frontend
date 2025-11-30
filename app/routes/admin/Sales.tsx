import React, { useState, useEffect } from 'react';
import { SalesTable } from '~/components/organisms/SalesTable';
import { ventasService } from '~/services/api/ventasService';
import type { Venta } from '~/services/types';

const Sales: React.FC = () => {
    const [sales, setSales] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await ventasService.getAll();
            setSales(data);
        } catch (err: any) {
            console.error('Error cargando ventas:', err);
            setError('Error al cargar el historial de ventas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600 animate-pulse">Cargando ventas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-auto max-w-2xl">
                <div className="text-red-800 mb-4">{error}</div>
                <button
                    onClick={loadSales}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
                >
                    🔄 Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Historial de Ventas</h1>
                <button
                    onClick={loadSales}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                    🔄 Actualizar
                </button>
            </div>

            {sales.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl p-12 text-center border-4 border-dashed border-gray-200">
                    <div className="text-7xl text-gray-300 mb-6">📊</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Sin ventas</h2>
                    <p className="text-gray-500 text-lg">No hay ventas registradas aún</p>
                </div>
            ) : (
                <SalesTable sales={sales} />
            )}
        </div>
    );
};

export default Sales;
