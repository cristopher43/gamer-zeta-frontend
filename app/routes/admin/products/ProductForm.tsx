
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '~/components/atoms/Button';
import { productosService } from '~/services/api/productosService';
import type { CreateProductoDto, UpdateProductoDto } from '~/services/types';

interface ProductFormData {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    activo: boolean;
}

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState<ProductFormData>({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoria: 'Consolas',
        activo: true
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (isEditing && id) {
            loadProduct(Number(id));
        }
    }, [id, isEditing]);

    const loadProduct = async (productId: number) => {
        try {
            setLoadingData(true);
            const producto = await productosService.getById(productId);

            setFormData({
                nombre: producto.nombre,
                descripcion: producto.descripcion || '',
                precio: producto.precio,
                stock: producto.stock,
                categoria: producto.categoria || 'Consolas',
                activo: producto.activo
            });

            console.log('✅ Producto cargado:', producto);
        } catch (err: any) {
            console.error('Error cargando producto:', err);
            const errorMsg = err.response?.data?.message || 'Error al cargar el producto';
            alert(errorMsg);
            navigate('/admin/products');
        } finally {
            setLoadingData(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (formData.precio <= 0) {
            newErrors.precio = 'El precio debe ser mayor a 0';
        }

        if (formData.stock < 0) {
            newErrors.stock = 'El stock no puede ser negativo';
        }

        if (!formData.categoria) {
            newErrors.categoria = 'La categoría es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isEditing && id) {
                // Actualizar producto existente
                const updateData: UpdateProductoDto = {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion || undefined,
                    precio: formData.precio,
                    stock: formData.stock,
                    categoria: formData.categoria,
                    activo: formData.activo
                };

                await productosService.update(Number(id), updateData);
                console.log('Producto actualizado');
                alert('Producto actualizado exitosamente');

            } else {
                // Crear nuevo producto
                const createData: CreateProductoDto = {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion || undefined,
                    precio: formData.precio,
                    stock: formData.stock,
                    categoria: formData.categoria
                };

                await productosService.create(createData);
                console.log('Producto creado');
                alert('Producto creado exitosamente');
            }

            navigate('/admin/products');

        } catch (err: any) {
            console.error('❌ Error guardando producto:', err);
            console.error('Detalles:', err.response?.data);

            const errorMsg = err.response?.data?.message ||
                (Array.isArray(err.response?.data?.message)
                    ? err.response.data.message.join(', ')
                    : 'Error al guardar el producto');

            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) :
                type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    value
        }));

        // Limpiar error del campo al editar
        if (errors[name as keyof ProductFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {isEditing ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
                </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Producto *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Ej: PlayStation 5"
                            />
                            {errors.nombre && (
                                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción (Opcional)
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                disabled={loading}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                placeholder="Descripción del producto..."
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría *
                            </label>
                            <select
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                                    errors.categoria ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="Consolas">Consolas</option>
                                <option value="Juegos PS5">Juegos PS5</option>
                                <option value="Juegos Xbox">Juegos Xbox</option>
                                <option value="Juegos Switch">Juegos Switch</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Periféricos">Periféricos</option>
                                <option value="Monitores">Monitores</option>
                                <option value="Componentes PC">Componentes PC</option>
                                <option value="Muebles">Muebles</option>
                            </select>
                            {errors.categoria && (
                                <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Precio */}
                            <div>
                                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio (CLP) *
                                </label>
                                <input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                                        errors.precio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    min="0"
                                    step="1"
                                />
                                {errors.precio && (
                                    <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock *
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                                        errors.stock ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    min="0"
                                    step="1"
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Estado Activo - Solo en edición */}
                        {isEditing && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    name="activo"
                                    checked={formData.activo}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-100"
                                />
                                <label htmlFor="activo" className="ml-2 text-sm font-medium text-gray-700">
                                    Producto activo (visible para la venta)
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 mt-8">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/admin/products')}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;