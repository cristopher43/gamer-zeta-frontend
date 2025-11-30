import axiosInstance from './axiosConfig';
import type { Venta, CreateVentaDto, UpdateVentaDto } from '../types';

const validateId = (id: number, functionName: string): void => {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
        throw new Error(`[${functionName}] ID inválido: ${id}. Debe ser un número entero positivo.`);
    }
};

export const ventasService = {
    getAll: async (): Promise<Venta[]> => {
        const response = await axiosInstance.get<Venta[]>('/ventas');
        return response.data;
    },

    getById: async (id: number): Promise<Venta> => {
        validateId(id, 'getById');
        const response = await axiosInstance.get<Venta>(`/ventas/${id}`);
        return response.data;
    },

    getByUsuario: async (usuarioId: number): Promise<Venta[]> => {
        validateId(usuarioId, 'getByUsuario');
        const response = await axiosInstance.get<Venta[]>(`/ventas/usuario/${usuarioId}`);
        return response.data;
    },

    getVentasDiarias: async (): Promise<Venta[]> => {
        const response = await axiosInstance.get<Venta[]>('/ventas/diarias');
        return response.data;
    },

    create: async (data: CreateVentaDto): Promise<Venta> => {
        validateId(data.usuarioId, 'create');

        const payload = {
            usuarioId: Number(data.usuarioId),
            metodoPago: data.metodoPago,
            detalleProductos: data.detalleProductos.map(d => ({
                productoId: Number(d.productoId),
                cantidad: Number(d.cantidad),
            })),
            cliente: data.cliente || undefined,
            rut: data.rut || undefined,
        };

        const response = await axiosInstance.post<Venta>('/ventas', payload);
        return response.data;
    },

    update: async (id: number, data: UpdateVentaDto): Promise<Venta> => {
        validateId(id, 'update');
        const response = await axiosInstance.patch<Venta>(`/ventas/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        validateId(id, 'delete');
        await axiosInstance.delete(`/ventas/${id}`);
    },
};
