'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePOSStore } from '../store/pos-store';
import { POSProduct } from '../types';
import { ModifierModal } from './modifier-modal';

interface GridProps {
  products: POSProduct[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export function POSProductGrid({ products }: GridProps) {
  const { searchQuery, selectedCategoryId, addItem } = usePOSStore();
  const [activeProduct, setActiveProduct] = useState<POSProduct | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryId ? p.category_id === selectedCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: POSProduct) => {
    if (product.has_modifiers || product.is_combo) {
      setActiveProduct(product);
    } else {
      addItem(product, 1, [], '');
    }
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 overflow-y-auto content-start h-[calc(100vh-140px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProducts.length === 0 ? (
          <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-400 mt-20">
            <span className="text-lg font-bold">No se encontraron productos</span>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.button
              key={product.id}
              onClick={() => handleProductClick(product)}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all aspect-square relative overflow-hidden group"
            >
              <div className="w-full h-2/3 bg-gray-100 rounded-t-xl flex items-center justify-center p-2 group-hover:bg-gray-200 transition-colors">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="object-cover w-full h-full rounded-t-xl group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <span className="text-gray-400 font-bold text-3xl group-hover:text-gray-600 transition-colors">{product.name.charAt(0)}</span>
                )}
              </div>
              <div className="w-full h-1/3 p-2 flex flex-col justify-center items-center bg-white rounded-b-xl">
                <span className="text-xs font-semibold text-center leading-tight line-clamp-2 text-gray-800">{product.name}</span>
                <motion.span
                  className="text-sm font-bold text-black mt-1"
                  whileHover={{ scale: 1.1 }}
                >
                  ${product.price.toFixed(2)}
                </motion.span>
              </div>

              {(product.has_modifiers || product.is_combo) && (
                <motion.div
                  className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Personalizar
                </motion.div>
              )}
            </motion.button>
          ))
        )}
      </motion.div>

      {activeProduct && (
        <ModifierModal 
          product={activeProduct} 
          onClose={() => setActiveProduct(null)} 
        />
      )}
    </>
  );
}