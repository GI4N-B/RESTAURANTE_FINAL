'use client';

import { useState } from 'react';
import { POSProduct, CartModifier } from '../types';
import { usePOSStore } from '../store/pos-store';

interface ModifierModalProps {
  product: POSProduct;
  onClose: () => void;
}

export function ModifierModal({ product, onClose }: ModifierModalProps) {
  const { addItem } = usePOSStore();
  const [selectedMods, setSelectedMods] = useState<CartModifier[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Simulación de grupos de modificadores (idealmente vendrían de useProductModifiers)
  const mockGroups = [
    { name: 'Término de la carne', required: true, options: [{ name: 'Rojo', price: 0 }, { name: 'Medio', price: 0 }, { name: 'Bien Cocido', price: 0 }] },
    { name: 'Adicionales', required: false, options: [{ name: 'Queso Extra', price: 1.50 }, { name: 'Tocino', price: 2.00 }] }
  ];

  const handleToggleOption = (groupName: string, optionName: string, price: number, isRadio: boolean) => {
    setSelectedMods(prev => {
      if (isRadio) {
        // Remover otra opción del mismo grupo de radio
        const filtered = prev.filter(m => m.group_name !== groupName);
        return [...filtered, { group_name: groupName, option_name: optionName, price_adjustment: price }];
      } else {
        // Toggle (Checkbox)
        const exists = prev.find(m => m.option_name === optionName && m.group_name === groupName);
        if (exists) return prev.filter(m => m !== exists);
        return [...prev, { group_name: groupName, option_name: optionName, price_adjustment: price }];
      }
    });
  };

  const currentTotal = (product.price + selectedMods.reduce((sum, mod) => sum + mod.price_adjustment, 0)) * quantity;

  const handleSave = () => {
    addItem(product, quantity, selectedMods, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button onClick={onClose} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold">✕</button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {mockGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                {group.required && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">Requerido</span>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {group.options.map((opt, oIdx) => {
                  const isSelected = selectedMods.some(m => m.group_name === group.name && m.option_name === opt.name);
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleToggleOption(group.name, opt.name, opt.price, group.required)}
                      className={`p-4 border-2 rounded-xl text-left flex justify-between items-center transition-all ${
                        isSelected ? 'border-black bg-gray-50 ring-2 ring-black ring-inset' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="font-semibold">{opt.name}</span>
                      {opt.price > 0 && <span className="text-gray-500 font-medium">+${opt.price.toFixed(2)}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Notas para cocina</h3>
             <textarea 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               className="w-full border-2 border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-black"
               rows={3}
               placeholder="Ej. Sin cebolla, alérgica al maní..."
             />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center bg-gray-100 rounded-xl border border-gray-200 h-14 w-40">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full text-2xl font-bold text-gray-600">-</button>
            <span className="flex-1 text-center font-extrabold text-xl">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full text-2xl font-bold text-gray-600">+</button>
          </div>

          <button onClick={handleSave} className="bg-black text-white px-8 h-14 rounded-xl font-bold text-lg flex items-center gap-3 active:scale-95 transition-transform">
            Agregar <span className="bg-white/20 px-2 py-1 rounded text-sm">${currentTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}