// app/services/api/boletasService.ts
import axiosInstance from './axiosConfig';

export interface Boleta {
    id: number;
    numero: string;
    ventaId: number;
    fecha: string;
    total: number;
    cliente?: string;
    rut?: string;
}

export interface CreateBoletaDto {
    ventaId: number;
    cliente?: string;
    rut?: string;
}

export const boletasService = {
    create: async (data: CreateBoletaDto): Promise<Boleta> => {
        console.log('📤 Creando boleta:', data);
        const response = await axiosInstance.post<Boleta>('/boletas', data);
        console.log('✅ Boleta creada:', response.data);
        return response.data;
    },

    getByVenta: async (ventaId: number): Promise<Boleta> => {
        const response = await axiosInstance.get<Boleta>(`/boletas/venta/${ventaId}`);
        return response.data;
    },

    getByNumero: async (numero: string): Promise<Boleta> => {
        const response = await axiosInstance.get<Boleta>(`/boletas/numero/${numero}`);
        return response.data;
    },

    getAll: async (): Promise<Boleta[]> => {
        const response = await axiosInstance.get<Boleta[]>('/boletas');
        return response.data;
    },
};