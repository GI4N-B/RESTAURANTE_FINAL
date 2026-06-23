'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useUsers } from '../api/queries';
import { useUserMutations } from '../api/mutations';
import { useUserStore } from '../store/user-store';
import { useDebounce } from '@/hooks/useDebounce';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';

export function UserDataTable({ companyId }: { companyId: string }) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data: response, isLoading, isFetching } = useUsers(companyId, {
    page,
    limit: 20,
    searchQuery: debouncedSearch,
  });

  const { suspend, delete: deleteUser, resetPassword } = useUserMutations();
  const { setSelectedUser, setModalOpen } = useUserStore();

  const users = response?.users || [];
  const totalPages = response?.totalPages || 1;

  const handleDelete = (userId: string) => {
    if (confirm('¿Estás seguro? El usuario será marcado como eliminado (soft delete).')) {
      deleteUser.mutate(userId);
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPass = prompt('Ingrese nueva contraseña:');
    if (newPass && newPass.length >= 8) {
      resetPassword.mutate({ id: userId, pass: newPass });
    } else if (newPass) {
      alert('La contraseña debe tener al menos 8 caracteres');
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1); // Resetear a primera página al buscar
          }}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background transition-all"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card/50 backdrop-blur-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Rol</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Estado</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin size-4 border-2 border-primary/20 border-t-primary rounded-full" />
                    Cargando...
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-foreground">{user.full_name}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                      animate={{ opacity: user.status === 'ACTIVE' ? 1 : 0.7 }}
                    >
                      {user.status}
                    </motion.span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setModalOpen(true);
                        }}
                        className="text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          suspend.mutate({
                            id: user.id,
                            suspend: user.status === 'ACTIVE',
                          })
                        }
                        className="text-xs"
                      >
                        {user.status === 'ACTIVE' ? 'Suspender' : 'Activar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                        className="text-xs"
                      >
                        Reset PW
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading || isFetching}
        />
      )}

      {/* Info de resultados */}
      {!isLoading && response && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {users.length} de {response.total} usuarios
        </div>
      )}
    </motion.div>
  );
}