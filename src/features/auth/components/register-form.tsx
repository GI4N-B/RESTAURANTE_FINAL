'use client';

import React, { useState } from 'react';
import { signUpWithEmail } from '../api/actions';

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await signUpWithEmail(formData);

    if (!res.success) {
      setError(res.error || 'Ocurrió un error durante el registro.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border text-center">
        <h2 className="text-xl font-bold text-green-600 mb-2">¡Registro Exitoso!</h2>
        <p className="text-sm text-gray-600">Hemos enviado un correo de confirmación. Por favor revisa tu bandeja de entrada para activar la cuenta de tu restaurante.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 text-center">Registrar Cadena / Restaurante</h2>
      
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial del Restaurante</label>
        <input 
        name="restaurantName" 
        type="text" 
        required 
        placeholder="Mi Restaurante"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Administrador</label>
        <input 
        name="email" 
        type="email" 
        required 
        placeholder="admin@restaurante.com"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Corporativa</label>
        <input 
        name="password" 
        type="password" 
        required 
        placeholder="••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50">
        {loading ? 'Creando cuenta corporativa...' : 'Dar de alta Empresa'}
      </button>
    </form>
  );
}