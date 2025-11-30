import React from 'react';

interface BoletaHeaderProps {
    numero: string;
    fecha: string;
}

export const BoletaHeaderAtom: React.FC<BoletaHeaderProps> = ({ numero, fecha }) => (
    <div className="text-center mb-12 print:mb-16">
        {/* Logo */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg print:mb-8">
            <span className="text-2xl font-black text-white drop-shadow-md">GZ</span>
        </div>

        {/* Nombre Empresa */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight print:text-3xl">
            GAMER ZETA
        </h1>

        {/* Datos Empresa */}
        <p className="text-lg text-gray-600 mb-6 print:text-base">Tienda Gaming - Santiago, Chile</p>

        {/* Datos Boleta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm print:grid-cols-1 print:gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <span className="block font-bold text-gray-700 text-sm mb-1">Boleta Nº:</span>
                <span className="font-black text-2xl text-blue-600 block print:text-xl">{numero}</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                <span className="block font-bold text-gray-700 text-sm mb-1">Fecha Emisión:</span>
                <span className="font-semibold text-lg text-emerald-800 print:text-base">{fecha}</span>
            </div>
        </div>
    </div>
);
