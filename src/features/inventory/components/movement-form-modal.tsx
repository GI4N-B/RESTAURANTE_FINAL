'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movementSchema, MovementFormData } from '../validations/inventory-schemas';
import { useInventoryMutations } from '../api/queries';

export function MovementFormModal({ inventoryId, locationId, onClose }: { inventoryId: string, locationId: string, onClose: () => void }) {
  const { processMovement } = useInventoryMutations();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      inventory_id: inventoryId,
      location_id: locationId,
      movement_type: 'PURCHASE',
      quantity: 0
    }
  });

  const type = watch('movement_type');
  const isPurchase = type === 'PURCHASE';

  const onSubmit = async (data: MovementFormData) => {
    try {
      // Ajustar el signo de la cantidad basado en el tipo
      if (['WASTE', 'PRODUCTION'].includes(data.movement_type)) {
        data.quantity = -Math.abs(data.quantity);
      }
      
      await processMovement.mutateAsync(data);
      onClose();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Registrar Movimiento</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Tipo de Movimiento</label>
            <select {...register('movement_type')} className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-black">
              <option value="PURCHASE">Compra a Proveedor (+)</option>
              <option value="WASTE">Merma / Desperdicio (-)</option>
              <option value="PRODUCTION">Consumo por Producción (-)</option>
              <option value="ADJUSTMENT">Ajuste de Inventario (+/-)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Cantidad</label>
              <input 
                type="number" 
                step="0.01" 
                {...register('quantity', { valueAsNumber: true })} 
                className="mt-1 w-full p-2 border rounded-lg"
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>

            {isPurchase && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">Costo Unitario ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  {...register('unit_cost', { valueAsNumber: true })} 
                  className="mt-1 w-full p-2 border rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Notas / Justificación</label>
            <textarea 
              {...register('notes')} 
              className="mt-1 w-full p-2 border rounded-lg" 
              rows={3}
              placeholder="Ej. Factura #1234, Merma por caducidad..."
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">Cancelar</button>
            <button type="submit" disabled={processMovement.isPending} className="px-4 py-2 bg-black text-white rounded-lg font-medium disabled:opacity-50">
              {processMovement.isPending ? 'Procesando...' : 'Guardar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}