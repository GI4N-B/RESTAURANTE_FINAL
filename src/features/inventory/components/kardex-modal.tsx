'use client';

import { useKardex } from '../api/queries';

export function KardexModal({ inventoryId, onClose }: { inventoryId: string, onClose: () => void }) {
  const { data: movements, isLoading } = useKardex(inventoryId);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Kardex (Libro Mayor)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="animate-pulse">Cargando movimientos...</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-900 text-white font-bold">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3 text-right">Cant.</th>
                  <th className="px-4 py-3 text-right">Saldo Final</th>
                  <th className="px-4 py-3">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {movements?.map((mov) => {
                  const isPositive = mov.quantity > 0;
                  return (
                    <tr key={mov.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{new Date(mov.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold">{mov.movement_type}</td>
                      <td className="px-4 py-3">{mov.user?.full_name || 'Sistema'}</td>
                      <td className={`px-4 py-3 text-right font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{mov.quantity}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-black">{mov.new_stock}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-xs">{mov.notes}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}