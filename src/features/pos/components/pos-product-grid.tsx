'use client';

import { useState } from 'react';
import { usePOSStore } from '../store/pos-store';
import { POSProduct } from '../types';
import { ModifierModal } from './modifier-modal';

interface GridProps {
  products: POSProduct[];
}

export function POSProductGrid({ products }: GridProps) {
  const { searchQuery, selectedCategoryId, addItem } = usePOSStore();
  const [activeProduct, setActiveProduct] = useState<POSProduct | null>(null);

  // Filtro Instantáneo Cliente
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryId ? p.category_id === selectedCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: POSProduct) => {
    if (product.has_modifiers || product.is_combo) {
      setActiveProduct(product); // Abre el modal de modificadores/combos
    } else {
      addItem(product, 1, [], ''); // Venta rápida
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 overflow-y-auto content-start h-[calc(100vh-140px)]">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-black active:scale-95 transition-all aspect-square relative"
          >
            {/* Si no hay imagen, un placeholder de color. Ideal para POS rápidos. */}
            <div className="w-full h-2/3 bg-gray-100 rounded-t-xl flex items-center justify-center p-2">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-cover w-full h-full rounded-t-xl" />
              ) : (
                <span className="text-gray-400 font-bold text-3xl">{product.name.charAt(0)}</span>
              )}
            </div>
            <div className="w-full h-1/3 p-2 flex flex-col justify-center items-center bg-white rounded-b-xl">
              <span className="text-xs font-semibold text-center leading-tight line-clamp-2 text-gray-800">{product.name}</span>
              <span className="text-sm font-bold text-black mt-1">${product.price.toFixed(2)}</span>
            </div>
            
            {/* Indicador visual de combo/modificador */}
            {(product.has_modifiers || product.is_combo) && (
              <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full font-bold">
                Personalizar
              </div>
            )}
          </button>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-400 mt-20">
            <span className="text-lg font-bold">No se encontraron productos</span>
          </div>
        )}
      </div>

      {activeProduct && (
        <ModifierModal 
          product={activeProduct} 
          onClose={() => setActiveProduct(null)} 
        />
      )}
    </>
  );
}