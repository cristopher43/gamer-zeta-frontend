import React from 'react';
import { Badge } from '~/components/atoms/Badge';
import { Spinner } from '~/components/atoms/Spinner';

interface Sale {
    id: number;
    fecha: string;
    total: number;
    metodoPago: string;
    estado: string;
    cajero?: string;
}

interface SalesTableProps {
    sales: Sale[];
    isLoading?: boolean;
    onViewDetails?: (id: number) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
                                                          sales,
                                                          isLoading = false,
                                                          onViewDetails
                                                      }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    if (sales.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No hay ventas registradas
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cajero
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Método Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                    </th>
                    {onViewDetails && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Acciones
                        </th>
                    )}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{sale.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(sale.fecha).toLocaleDateString('es-CL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.cajero || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.metodoPago}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${sale.total.toLocaleString('es-CL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={sale.estado === 'completada' ? 'success' : 'warning'}>
                                {sale.estado}
                            </Badge>
                        </td>
                        {onViewDetails && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                    onClick={() => onViewDetails(sale.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Ver detalles
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};