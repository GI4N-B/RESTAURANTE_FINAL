'use client';

import React, { useState } from 'react';
import { verify2FA } from '../api/actions';

interface MfaSetupProps {
  factorId: string;
  structuralOnly?: boolean;
}

export function MfaSetup({ factorId, structuralOnly = false }: MfaSetupProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Si viene del flujo estructurado preparado de login, pasamos un id de factor general o resuelto
    const res = await verify2FA(code, factorId || 'mfa_factor_structural_id');
    if (!res.success) {
      setError(res.error || 'Código de doble factor inválido.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleVerify} className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-4 text-center">
      <h2 className="text-xl font-bold text-gray-900">Verificación de Doble Factor (2FA)</h2>
      <p className="text-xs text-gray-500">Introduce el código temporal generado por tu aplicación de autenticación (Google Authenticator / Microsoft Authenticator).</p>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      <div>
        <input type="text" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" required className="w-full text-center tracking-widest text-2xl font-bold px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
        {loading ? 'Validando token...' : 'Confirmar Identidad'}
      </button>
    </form>
  );
}