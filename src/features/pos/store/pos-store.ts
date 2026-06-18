import { create } from 'zustand';
import { CartItem, POSProduct, PaymentMethod, CartModifier } from '../types';

interface POSState {
  cart: CartItem[];
  searchQuery: string;
  selectedCategoryId: string | null;
  discount: { type: 'PERCENTAGE' | 'FIXED'; value: number };
  tip: { type: 'PERCENTAGE' | 'FIXED'; value: number };
  taxRate: number; // 0.18 para IGV (18%)
  
  // Acciones de UI
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (id: string | null) => void;
  
  // Acciones de Carrito
  addItem: (product: POSProduct, quantity: number, modifiers: CartModifier[], notes: string) => void;
  removeItem: (uuid: string) => void;
  updateQuantity: (uuid: string, quantity: number) => void;
  clearCart: () => void;
  
  // Acciones Financieras
  setDiscount: (type: 'PERCENTAGE' | 'FIXED', value: number) => void;
  setTip: (type: 'PERCENTAGE' | 'FIXED', value: number) => void;
}

export const usePOSStore = create<POSState>((set) => ({
  cart: [],
  searchQuery: '',
  selectedCategoryId: null,
  discount: { type: 'FIXED', value: 0 },
  tip: { type: 'FIXED', value: 0 },
  taxRate: 0.18,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (id) => set({ selectedCategoryId: id }),

  addItem: (product, quantity, modifiers, notes) => set((state) => {
    // Si no tiene modificadores ni notas, intentamos agruparlo (Venta Rápida)
    if (modifiers.length === 0 && !notes) {
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === product.id && item.modifiers.length === 0 && !item.notes
      );
      if (existingItemIndex >= 0) {
        const newCart = [...state.cart];
        newCart[existingItemIndex].quantity += quantity;
        return { cart: newCart };
      }
    }

    const modifierSum = modifiers.reduce((acc, mod) => acc + mod.price_adjustment, 0);
    const unit_total = product.price + modifierSum;

    return {
      cart: [...state.cart, {
        uuid: crypto.randomUUID(),
        product,
        quantity,
        modifiers,
        notes,
        unit_total
      }]
    };
  }),

  removeItem: (uuid) => set((state) => ({
    cart: state.cart.filter(item => item.uuid !== uuid)
  })),

  updateQuantity: (uuid, quantity) => set((state) => ({
    cart: state.cart.map(item => 
      item.uuid === uuid ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),

  clearCart: () => set({ cart: [], discount: { type: 'FIXED', value: 0 }, tip: { type: 'FIXED', value: 0 } }),

  setDiscount: (type, value) => set({ discount: { type, value } }),
  setTip: (type, value) => set({ tip: { type, value } }),
}));