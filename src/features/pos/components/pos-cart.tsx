'use client';

import { usePOSStore } from '../store/pos-store';
import { useState } from 'react';
import { CheckoutModal } from './checkout-modal';

export function POSCart() {
  const { cart, updateQuantity, removeItem, discount, tip, taxRate, clearCart } = usePOSStore();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  // Cálculos Financieros Reactivos
  const subtotal = cart.reduce((sum, item) => sum + (item.unit_total * item.quantity), 0);
  const discountAmount = discount.type === 'PERCENTAGE' ? subtotal * (discount.value / 100) : discount.value;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  
  // Impuestos calculados en base al subtotal con descuento
  const taxAmount = subtotalAfterDiscount * taxRate; 
  const tipAmount = tip.type === 'PERCENTAGE' ? subtotalAfterDiscount * (tip.value / 100) : tip.value;
  
  const total = subtotalAfterDiscount + taxAmount + tipAmount;

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen shadow-2xl relative z-10">
      {/* Header Carrito */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Comanda Actual</h2>
        <button onClick={clearCart} className="text-sm text-red-600 font-semibold hover:bg-red-50 px-3 py-1 rounded-lg">Vaciar</button>
      </div>

      {/* Lista de Items (Touch-scrollable) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
             <span className="text-sm">El carrito está vacío</span>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.uuid} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
              <div className="flex justify-between font-medium text-gray-900">
                <span className="truncate w-3/4">{item.product.name}</span>
                <span>${(item.unit_total * item.quantity).toFixed(2)}</span>
              </div>
              
              {/* Modificadores renderizados */}
              {item.modifiers.length > 0 && (
                <ul className="text-xs text-gray-500 mt-1 pl-2 border-l-2 border-gray-200">
                  {item.modifiers.map((mod, idx) => (
                    <li key={idx}>+ {mod.option_name} {mod.price_adjustment > 0 && `($${mod.price_adjustment})`}</li>
                  ))}
                </ul>
              )}

              {/* Controles Táctiles Grandes de Cantidad */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <button onClick={() => updateQuantity(item.uuid, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-xl text-gray-700 bg-gray-50 active:bg-gray-200">-</button>
                  <span className="w-10 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.uuid, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-xl text-gray-700 bg-gray-50 active:bg-gray-200">+</button>
                </div>
                <button onClick={() => removeItem(item.uuid)} className="text-red-500 bg-red-50 p-2 rounded-lg text-xs font-bold active:bg-red-100">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Panel Financiero y Cobro */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="space-y-1 mb-4 text-sm text-gray-600">
          <div className="flex justify-between"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
          {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Descuento:</span> <span>-${discountAmount.toFixed(2)}</span></div>}
          <div className="flex justify-between"><span>Impuestos ({(taxRate*100).toFixed(0)}%):</span> <span>${taxAmount.toFixed(2)}</span></div>
          {tipAmount > 0 && <div className="flex justify-between"><span>Propina:</span> <span>${tipAmount.toFixed(2)}</span></div>}
        </div>
        
        <div className="flex justify-between items-end mb-4 border-t border-gray-200 pt-2">
          <span className="text-gray-900 font-bold text-lg">Total</span>
          <span className="text-black font-extrabold text-3xl">${total.toFixed(2)}</span>
        </div>

        <button 
          onClick={() => setCheckoutOpen(true)}
          disabled={cart.length === 0}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-xl active:bg-gray-800 disabled:bg-gray-300 transition-colors shadow-lg"
        >
          Cobrar
        </button>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal 
          total={total} 
          onClose={() => setCheckoutOpen(false)} 
        />
      )}
    </div>
  );
}