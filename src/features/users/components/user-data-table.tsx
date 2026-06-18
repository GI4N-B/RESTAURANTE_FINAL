'use client';

import { useUsers } from '../api/queries';
import { useUserMutations } from '../api/mutations';
import { useUserStore } from '../store/user-store';

export function UserDataTable({ companyId }: { companyId: string }) {
  const { data: users, isLoading } = useUsers(companyId);
  const { suspend, delete: deleteUser, resetPassword } = useUserMutations();
  const { setSelectedUser, setModalOpen } = useUserStore();

  if (isLoading) return <div>Cargando personal...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Rol</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-6 py-4 font-medium text-gray-900">
                {user.full_name} <br/> <span className="text-xs text-gray-400">{user.email}</span>
              </td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2">
                <button 
                  onClick={() => { setSelectedUser(user); setModalOpen(true); }}
                  className="text-blue-600 hover:underline"
                >
                  Editar (Permisos/Sede)
                </button>
                <button 
                  onClick={() => suspend.mutate({ id: user.id, suspend: user.status === 'ACTIVE' })}
                  className="text-amber-600 hover:underline"
                >
                  {user.status === 'ACTIVE' ? 'Suspender' : 'Activar'}
                </button>
                <button 
                  onClick={() => {
                    const newPass = prompt('Ingrese nueva contraseña:');
                    if(newPass) resetPassword.mutate({ id: user.id, pass: newPass });
                  }}
                  className="text-purple-600 hover:underline"
                >
                  Reset PW
                </button>
                <button 
                  onClick={() => { if(confirm('¿Eliminar definitivamente?')) deleteUser.mutate(user.id); }}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}