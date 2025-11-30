import axiosInstance from './axiosConfig';
import type { Producto, CreateProductoDto, UpdateProductoDto } from '../types';

export const productosService = {
    getAll: async (): Promise<Producto[]> => {
        const response = await axiosInstance.get<Producto[]>('/productos');
        return response.data;
    },

    getById: async (id: number): Promise<Producto> => {
        const response = await axiosInstance.get<Producto>(`/productos/${id}`);
        return response.data;
    },

    getByCategoria: async (categoria: string): Promise<Producto[]> => {
        const response = await axiosInstance.get<Producto[]>(`/productos/categoria/${categoria}`);
        return response.data;
    },

    create: async (data: CreateProductoDto): Promise<Producto> => {
        // Limpiar y validar datos antes de enviar
        const payload = {
            nombre: data.nombre.trim(),
            descripcion: data.descripcion?.trim() || undefined,
            precio: Number(data.precio),
            stock: Number(data.stock),
            categoria: data.categoria?.trim() || undefined,
        };

        console.log('📤 Enviando producto:', payload);

        const response = await axiosInstance.post<Producto>('/productos', payload);

        console.log('✅ Respuesta del servidor:', response.data);
        return response.data;
    },

    update: async (id: number, data: UpdateProductoDto): Promise<Producto> => {
        // Construir payload solo con campos definidos
        const payload: any = {};

        if (data.nombre !== undefined) {
            payload.nombre = data.nombre.trim();
        }
        if (data.descripcion !== undefined) {
            payload.descripcion = data.descripcion?.trim() || undefined;
        }
        if (data.precio !== undefined) {
            payload.precio = Number(data.precio);
        }
        if (data.stock !== undefined) {
            payload.stock = Number(data.stock);
        }
        if (data.categoria !== undefined) {
            payload.categoria = data.categoria?.trim() || undefined;
        }
        if (data.activo !== undefined) {
            payload.activo = Boolean(data.activo);
        }

        console.log('📤 Actualizando producto:', payload);

        const response = await axiosInstance.patch<Producto>(`/productos/${id}`, payload);

        console.log('✅ Respuesta del servidor:', response.data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/productos/${id}`);
    },
};