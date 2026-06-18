'use client';

import { UserDataTable } from '@/features/users/components/user-data-table';
import { UserForm } from '@/features/users/components/user-form';
import { useUserStore } from '@/features/users/store/user-store';

export default function UsersManagementPage() {
  const { isModalOpen, setModalOpen, setSelectedUser } = useUserStore();
  
  // En producción este ID viene del contexto de sesión del usuario logueado
  const CURRENT_COMPANY_ID = 'empresa-uuid-generico'; 

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
          <p className="text-sm text-gray-500">Administra accesos, roles, sedes y pines de terminal (RBAC + ABAC).</p>
        </div>
        <button 
          onClick={() => { setSelectedUser(null); setModalOpen(true); }}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          + Nuevo Usuario
        </button>
      </div>

      <UserDataTable companyId={CURRENT_COMPANY_ID} />

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl">
            <UserForm />
          </div>
        </div>
      )}
    </div>
  );
}