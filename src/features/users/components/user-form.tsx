'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from '../validations/user-schemas';
import { useUserMutations } from '../api/mutations';
import { useUserStore } from '../store/user-store';
import { useEffect } from 'react';

export function UserForm() {
  const { selectedUser, setModalOpen } = useUserStore();
  const { create, update } = useUserMutations();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { company_id: 'TU_COMPANY_ID_AQUI' } // En producción, tomar del Auth Context
  });

  useEffect(() => {
    if (selectedUser) {
      reset({
        email: selectedUser.email,
        full_name: selectedUser.full_name,
        role: selectedUser.role,
        company_id: selectedUser.company_id,
        location_id: selectedUser.location_id,
        permissions: selectedUser.permissions,
      });
    } else {
      reset();
    }
  }, [selectedUser, reset]);

  const onSubmit = async (data: UserFormData) => {
    if (selectedUser) {
      await update.mutateAsync({ id: selectedUser.id, data });
    } else {
      await create.mutateAsync(data);
    }
    setModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg">
      <h2 className="text-xl font-bold">{selectedUser ? 'Editar' : 'Crear'} Usuario</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Nombre Completo</label>
          <input {...register('full_name')} className="border p-2 w-full rounded" />
          {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm">Email</label>
          <input {...register('email')} disabled={!!selectedUser} className="border p-2 w-full rounded disabled:bg-gray-100" />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm">Rol (RBAC)</label>
          <select {...register('role')} className="border p-2 w-full rounded">
            <option value="ADMIN">Administrador</option>
            <option value="MANAGER">Gerente de Sede</option>
            <option value="WAITER">Mesero</option>
            <option value="CHEF">Cocinero</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Sede (ABAC)</label>
          <select {...register('location_id')} className="border p-2 w-full rounded">
             {/* Map de ubicaciones aquí */}
            <option value="">Todas las sedes (Global)</option>
            <option value="sede-1-uuid">Sede Central</option>
          </select>
        </div>

        {!selectedUser && (
          <>
            <div>
              <label className="block text-sm">Contraseña</label>
              <input type="password" {...register('password')} className="border p-2 w-full rounded" />
            </div>
            <div>
              <label className="block text-sm">PIN (Terminal)</label>
              <input maxLength={4} {...register('pin')} className="border p-2 w-full rounded" />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
        <button type="submit" disabled={create.isPending || update.isPending} className="px-4 py-2 bg-black text-white rounded">
          {create.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}