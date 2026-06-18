'use client';

import { useInventoryStock } from '../api/queries';
import { useState } from 'react';
import { MovementFormModal } from './movement-form-modal';
import { KardexModal } from './kardex-modal';

export function StockTable({ locationId }: { locationId: string }) {
  const { data: stock, isLoading } = useInventoryStock(locationId);
  const [selectedItemForMovement, setSelectedItemForMovement] = useState<string | null>(null);
  const [selectedItemForKardex, setSelectedItemForKardex] = useState<string | null>(null);

  if (isLoading) return <div className="p-8 animate-pulse">Cargando inventario...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b">
          <tr>
            <th className="px-6 py-4">SKU / Producto</th>
            <th className="px-6 py-4">Categoría</th>
            <th className="px-6 py-4 text-right">Costo Unit.</th>
            <th className="px-6 py-4 text-right">Stock Actual</th>
            <th className="px-6 py-4 text-center">Estado</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stock?.map((item) => {
            const isLowStock = item.current_stock <= item.min_stock_alert;
            
            return (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{item.product.name}</div>
                  <div className="text-xs text-gray-400">{item.product.sku}</div>
                </td>
                <td className="px-6 py-4">{item.product.category}</td>
                <td className="px-6 py-4 text-right font-mono">${item.unit_cost.toFixed(2)}</td>
                <td className={`px-6 py-4 text-right font-bold text-lg ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                  {item.current_stock}
                </td>
                <td className="px-6 py-4 text-center">
                  {isLowStock ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Alerta</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Óptimo</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => setSelectedItemForMovement(item.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ajustar/Movimiento
                  </button>
                  <button 
                    onClick={() => setSelectedItemForKardex(item.id)}
                    className="text-gray-600 hover:text-black font-medium"
                  >
                    Ver Kardex
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedItemForMovement && (
        <MovementFormModal 
          inventoryId={selectedItemForMovement} 
          locationId={locationId}
          onClose={() => setSelectedItemForMovement(null)} 
        />
      )}

      {selectedItemForKardex && (
        <KardexModal 
          inventoryId={selectedItemForKardex} 
          onClose={() => setSelectedItemForKardex(null)} 
        />
      )}
    </div>
  );
}