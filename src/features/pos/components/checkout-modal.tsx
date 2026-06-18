'use client';

import { useState } from 'react';
import { usePOSStore } from '../store/pos-store';
import { useCheckout } from '../api/pos-queries';
import { PaymentMethod } from '../types';

export function CheckoutModal({ total, onClose }: { total: number, onClose: () => void }) {
  const { cart, clearCart } = usePOSStore();
  const checkoutMutation = useCheckout();
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [cashGiven, setCashGiven] = useState<string>('');

  const handleProcessPayment = async () => {
    try {
      await checkoutMutation.mutateAsync({ cart, total, method });
      alert('¡Pago exitoso! Ticket generado.');
      clearCart();
      onClose();
    } catch (error) {
      alert('Error procesando el pago.');
    }
  };

  const change = method === 'CASH' && cashGiven ? Math.max(0, parseFloat(cashGiven) - total) : 0;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex shadow-2xl overflow-hidden">
        
        {/* Panel Izquierdo: Resumen Rápido */}
        <div className="w-1/3 bg-gray-900 text-white p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-8">Resumen de Cobro</h2>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {cart.map(c => (
              <div key={c.uuid} className="flex justify-between border-b border-gray-700 pb-2 text-gray-300">
                <span>{c.quantity}x {c.product.name}</span>
                <span>${(c.unit_total * c.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="text-gray-400 mb-1">Monto a Cobrar</div>
            <div className="text-5xl font-black">${total.toFixed(2)}</div>
          </div>
        </div>

        {/* Panel Derecho: Métodos de Pago */}
        <div className="w-2/3 p-8 bg-gray-50 flex flex-col relative">
          <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 bg-white border border-gray-200 rounded-full flex justify-center items-center font-bold text-xl hover:bg-gray-100">✕</button>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {(['CASH', 'CARD', 'TRANSFER'] as PaymentMethod[]).map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`py-8 rounded-xl font-bold text-lg border-2 transition-all ${
                  method === m ? 'border-black bg-white shadow-md ring-4 ring-black/10' : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                {m === 'CASH' && 'Efectivo'}
                {m === 'CARD' && 'Tarjeta / POS'}
                {m === 'TRANSFER' && 'Transferencia'}
              </button>
            ))}
          </div>

          {method === 'CASH' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
              <label className="block text-gray-500 font-semibold mb-2">Efectivo Recibido</label>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-400">$</span>
                <input 
                  type="number" 
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="w-full text-5xl font-black bg-transparent border-none focus:ring-0 p-0 text-gray-900"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xl">
                <span className="text-gray-500 font-medium">Vuelto a entregar:</span>
                <span className="font-bold text-green-600">${change.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="mt-auto">
            <button 
              onClick={handleProcessPayment}
              disabled={checkoutMutation.isPending || (method === 'CASH' && parseFloat(cashGiven || '0') < total)}
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-2xl active:scale-[0.98] transition-transform disabled:bg-gray-300 disabled:text-gray-500 shadow-xl"
            >
              {checkoutMutation.isPending ? 'Procesando...' : `Confirmar Pago de $${total.toFixed(2)}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}