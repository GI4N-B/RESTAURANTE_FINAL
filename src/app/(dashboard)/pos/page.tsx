import { POSLayout } from '@/features/pos/components/pos-layout';

// Para asegurar que la terminal POS no quede renderizada estáticamente con datos viejos
export const dynamic = 'force-dynamic';

export default function POSPage() {
  return (
    // Reemplaza el Layout envolvente por defecto del dashboard para tener pantalla completa
    <div className="fixed inset-0 z-[100] bg-white">
      <POSLayout />
    </div>
  );
}