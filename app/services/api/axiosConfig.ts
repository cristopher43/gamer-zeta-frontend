// File: app/services/api/axiosConfig.ts

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor ANTES de las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token'); // Obtiene el token

        console.log('🔑 Token en interceptor:', token ? '✓ Presente' : '✗ Ausente');

        if (token) {
            // ✅ Adjunta el token con el formato Bearer
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor DESPUÉS de las respuestas
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en respuesta:', error.response?.status, error.response?.data);

        if (error.response?.status === 401) {
            console.warn('❌ Sesión inválida detectada por 401, cerrando sesión...');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            // Redirige al login para reautenticar
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;