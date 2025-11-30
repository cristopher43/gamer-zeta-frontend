export interface RegisterDto {
    name: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    email: string;
    name: string;
    rol: 'admin' | 'cashier';
}

export interface UserProfile {
    id: number;
    sub: string;
    email: string;
    name: string;
    rol: 'admin' | 'cashier';
    iat: number;
    exp: number;
}

// Producto Types
export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoria: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductoDto {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoria: string;
}

export interface UpdateProductoDto {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    stock?: number;
    categoria?: string;
    activo?: boolean;
}

// Venta Types
export interface DetalleProducto {
    productoId: number;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface Venta {
    id: number;
    usuarioId: number;
    fecha: string;
    subtotal: number;
    iva: number;
    total: number;
    metodoPago: string;
    estado: string;
    detalleProductos: DetalleProducto[];
    usuario?: {
        id?: number;
        name: string;
        email: string;
        rol?: string;
    };
    boleta?: Boleta;
}


export interface CreateVentaDto {
    usuarioId: number;
    metodoPago: string;
    detalleProductos: {
        productoId: number;
        cantidad: number;
    }[];
    cliente?: string;
    rut?: string;
}

export interface UpdateVentaDto {
    estado?: string;
}

// Boleta Types
export interface Boleta {
    id: number;
    numero: string;
    ventaId: number;
    fecha: string;
    total: number;
    cliente?: string;
    rut?: string;
    venta?: Venta;
}

export interface CreateBoletaDto {
    ventaId: number;
    cliente?: string;
    rut?: string;
}

// Dashboard Stats
export interface DashboardStats {
    totalVentas: number;
    ventasHoy: number;
    productosVendidos: number;
    ingresoTotal: string;
}


export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    stock?: number;
}

export interface BoletaOrganismProps {
    boleta: Boleta | any;
    venta: { subtotal: number; iva: number; total: number };
    cartItems: CartItem[];
    metodoPago: string;
    cajero: string;
    onPrint: () => void;
    onClose: () => void;
}
