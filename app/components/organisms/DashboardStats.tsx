import React from 'react';
import { StatCard } from '~/components/molecules/StatCard';

interface DashboardStatsProps {
    totalVentas: number;
    ventasHoy: number;
    productosVendidos: number;
    ingresoTotal: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
                                                                  totalVentas,
                                                                  ventasHoy,
                                                                  productosVendidos,
                                                                  ingresoTotal,
                                                              }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                icon="💰"
                label="Ingreso Total"
                value={ingresoTotal}
                variant="green"
            />
            <StatCard
                icon="📊"
                label="Total Ventas"
                value={totalVentas}
                variant="blue"
            />
            <StatCard
                icon="🔥"
                label="Ventas Hoy"
                value={ventasHoy}
                variant="yellow"
            />
            <StatCard
                icon="📦"
                label="Productos Vendidos"
                value={productosVendidos}
                variant="purple"
            />
        </div>
    );
};