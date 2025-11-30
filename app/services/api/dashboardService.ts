import { ventasService } from './ventasService';
import type { DashboardStats } from '../types';

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        try {
            // Obtener todas las ventas y las ventas del día
            const ventas = await ventasService.getAll();
            const ventasHoy = await ventasService.getVentasDiarias();

            // Calcular el total de productos vendidos (unidades)
            const productosVendidos = ventas.reduce((total, venta) => {
                if (!venta.detalleProductos || !Array.isArray(venta.detalleProductos)) {
                    console.warn(`Venta ${venta.id} no tiene detalleProductos`);
                    return total;
                }

                const cantidad = venta.detalleProductos.reduce((sum, detalle) => {
                    return sum + Number(detalle.cantidad);
                }, 0);

                return total + cantidad;
            }, 0);

            // Calcular el ingreso total
            const ingresoTotal = ventas.reduce((total, venta) => {
                return total + Number(venta.total);
            }, 0);

            // Retornar las estadísticas con formato chileno
            return {
                totalVentas: ventas.length,
                ventasHoy: ventasHoy.length,
                productosVendidos,
                ingresoTotal: `$${Math.round(ingresoTotal).toLocaleString('es-CL')}`,
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    },
};