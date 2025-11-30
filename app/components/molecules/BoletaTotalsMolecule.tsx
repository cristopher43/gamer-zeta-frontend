import React from 'react';
import { PriceAtom } from '../atoms/PriceAtom';

interface BoletaTotalsProps {
    subtotal: number;
    iva: number;
    total: number;
}

export const BoletaTotalsMolecule: React.FC<BoletaTotalsProps> = ({
                                                                      subtotal,
                                                                      iva,
                                                                      total
                                                                  }) => (
    <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-4 border-gray-200 rounded-3xl p-8 mb-12 shadow-2xl print:bg-white print:shadow-none print:border-2 print:p-6">
        {/* Subtotales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-1 print:gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-semibold text-gray-700 uppercase tracking-wide">Neto</span>
                    <PriceAtom amount={subtotal} className="text-2xl font-black text-gray-900" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-semibold text-gray-700 uppercase tracking-wide">IVA 19%</span>
                    <PriceAtom amount={iva} className="text-2xl font-black text-blue-600" />
                </div>
            </div>
        </div>

        {/* TOTAL PRINCIPAL */}
        <div className="bg-gradient-to-r from-emerald-100 to-blue-100 border-4 border-emerald-300 rounded-3xl p-8 shadow-xl print:bg-white print:shadow-none print:border-2 print:p-6">
            <div className="flex items-baseline justify-between text-center print:flex-col print:items-center print:gap-4">
        <span className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 bg-white px-6 py-3 rounded-2xl shadow-lg print:text-xl">
          TOTAL
        </span>
                <PriceAtom
                    amount={total}
                    className="text-4xl md:text-5xl font-black text-emerald-700 drop-shadow-2xl print:text-3xl"
                />
            </div>
        </div>
    </div>
);
