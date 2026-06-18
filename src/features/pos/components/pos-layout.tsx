'use client';

import { usePOSCatalog, usePOSHistoryRealtime } from '../api/pos-queries';
import { usePOSStore } from '../store/pos-store';
import { POSProductGrid } from './pos-product-grid';
import { POSCart } from './pos-cart';
import { useState } from 'react';

export function POSLayout() {
  const { data: catalog, isLoading } = usePOSCatalog();
  const { data: history } = usePOSHistoryRealtime(); // Suscripción activa en background
  const { selectedCategoryId, setSelectedCategory, setSearchQuery } = usePOSStore();
  const [showHistory, setShowHistory] = useState(false);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-2xl font-bold animate-pulse">Cargando Terminal POS...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden select-none">
      
      {/* Columna Izquierda: Menú y Catálogo */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Topbar del POS */}
        <div className="bg-white h-20 px-6 border-b border-gray-200 flex items-center gap-4 justify-between shadow-sm z-10">
          <div className="flex items-center w-1/2">
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-black outline-none font-medium text-gray-800"
            />
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`px-6 py-4 font-bold rounded-xl transition-colors ${showHistory ? 'bg-black text-white' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Últimos Tickets
          </button>
        </div>

        {/* Contenido Principal (Filtros + Grid o Historial) */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar de Categorías (Vertical, amigable al scroll táctil) */}
          <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-6 font-bold text-lg border-b border-gray-100 transition-colors ${selectedCategoryId === null ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Todos
            </button>
            {catalog?.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-4 py-6 font-bold text-lg border-b border-gray-100 transition-colors ${selectedCategoryId === cat.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                style={selectedCategoryId === cat.id ? {} : { borderLeft: `6px solid ${cat.color}` }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Área Principal Dinámica */}
          <div className="flex-1 bg-gray-50 relative">
            {showHistory ? (
               <div className="p-8 absolute inset-0 overflow-y-auto bg-gray-100 z-20">
                 <h2 className="text-3xl font-bold mb-6">Historial de Tickets (Tiempo Real)</h2>
                 <div className="grid grid-cols-2 gap-4">
                   {history?.map(ticket => (
                     <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                       <div className="flex justify-between items-center mb-4">
                         <span className="font-bold text-xl text-gray-900">#{ticket.ticket_number || ticket.id.substring(0,8)}</span>
                         <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">Pagado</span>
                       </div>
                       <div className="text-gray-500 font-medium mb-4">{new Date(ticket.created_at).toLocaleTimeString()} • {ticket.payment_method}</div>
                       <div className="text-3xl font-black text-black">${ticket.total.toFixed(2)}</div>
                     </div>
                   ))}
                 </div>
               </div>
            ) : (
              <POSProductGrid products={catalog?.products || []} />
            )}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Carrito Activo */}
      <POSCart />
      
    </div>
  );
}