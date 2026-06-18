'use client';

import React, { useState } from 'react';
import { updatePassword } from '../api/actions';
import { useRouter } from 'next/navigation';

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await updatePassword(formData);

    if (!res.success) {
      setError(res.error || 'Error al actualizar la contraseña.');
    } else {
      router.push('/login?message=password-updated');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 text-center">Nueva Contraseña</h2>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Escribe la nueva contraseña corporativa</label>
        <input name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
        {loading ? 'Actualizando credenciales...' : 'Establecer Contraseña'}
      </button>
    </form>
  );
}