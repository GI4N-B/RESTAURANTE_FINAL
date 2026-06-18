'use client';

import React, { useState } from 'react';
import { resetPasswordRequest } from '../api/actions';

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await resetPasswordRequest(formData);

    if (!res.success) {
      setError(res.error || 'No se pudo procesar la solicitud.');
    } else {
      setMessage('Instrucciones de recuperación enviadas a tu buzón.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 text-center">Recuperar Contraseña</h2>
      <p className="text-xs text-gray-500 text-center">Te enviaremos un enlace seguro para restablecer tus credenciales operativas.</p>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
      {message && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{message}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Autorizado</label>
        <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50">
        {loading ? 'Enviando...' : 'Solicitar Enlace'}
      </button>
    </form>
  );
}