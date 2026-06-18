'use client';

import { StockTable } from '@/features/inventory/components/stock-table';

export default function InventoryDashboardPage() {
  // En un entorno real, este ID proviene del contexto global (ABAC) del usuario logueado.
  // Un usuario 'MANAGER' solo vería su sede, un 'ADMIN' podría cambiar de sede en un select.
  const CURRENT_LOCATION_ID = 'sede-uuid-generico'; 

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Control de Inventario</h1>
          <p className="text-gray-500 mt-1">Gestión de stock, mermas, producciones y libro mayor (Kardex).</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 shadow-sm">
            Transferir a otra sede
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-lg font-medium shadow-md hover:bg-gray-800">
            Descargar Reporte Excel
          </button>
        </div>
      </div>

      {/* Widgets Analíticos Rápidos */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-black">
          <div className="text-gray-500 text-sm font-semibold uppercase">Valor Total Inventario</div>
          <div className="text-3xl font-black mt-2">$24,500.00</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
          <div className="text-red-500 text-sm font-semibold uppercase">Alertas de Stock</div>
          <div className="text-3xl font-black mt-2">12 Items</div>
          <div className="text-xs text-gray-400 mt-1">Requieren compra inmediata</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-blue-500 text-sm font-semibold uppercase">Mermas (Últimos 30 días)</div>
          <div className="text-3xl font-black mt-2">-$340.50</div>
        </div>
      </div>

      {/* Tabla Principal de Stock */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Stock en Tiempo Real</h2>
          <input 
            type="text" 
            placeholder="Buscar por SKU o nombre..." 
            className="p-2 border rounded-lg w-64 text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>
        <StockTable locationId={CURRENT_LOCATION_ID} />
      </div>
    </div>
  );
}