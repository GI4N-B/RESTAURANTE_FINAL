'use client';

import React, { useState } from 'react';
import { loginWithEmail, loginWithMagicLink, loginWithPIN, signInWithOAuth } from '../api/actions';
import { MfaSetup } from './mfa-setup';

export function LoginForm() {
  const [mode, setMode] = useState<'password' | 'magic-link' | 'pin'>('password');
  const [pin, setPin] = useState('');
  const [emailForPin, setEmailForPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    let res;
    if (mode === 'password') {
      res = await loginWithEmail(formData);
    } else if (mode === 'magic-link') {
      res = await loginWithMagicLink(formData);
      if (res.success) setMessage('Enlace de acceso enviado a tu correo.');
    }

    if (res && !res.success) {
      setError(res.error || 'Ocurrió un error inesperado.');
    } else if (res?.twoFactorRequired) {
      setMfaRequired(true);
    }
    setLoading(false);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginWithPIN(pin, emailForPin);
    if (!res.success) setError(res.error || 'Error de PIN.');
    setLoading(false);
  };

  if (mfaRequired) {
    return <MfaSetup factorId="" structuralOnly={true} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-around mb-6 border-b border-gray-200 pb-2">
        <button type="button" onClick={() => setMode('password')} className={`pb-2 text-sm font-medium ${mode === 'password' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}>Contraseña</button>
        <button type="button" onClick={() => setMode('magic-link')} className={`pb-2 text-sm font-medium ${mode === 'magic-link' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}>Magic Link</button>
        <button type="button" onClick={() => setMode('pin')} className={`pb-2 text-sm font-medium ${mode === 'pin' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}>PIN Mesero/POS</button>
      </div>

      {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
      {message && <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 rounded-lg">{message}</div>}

      {mode !== 'pin' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>

          {mode === 'password' && (
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <a href="/forgot-password" className="text-xs text-gray-500 hover:underline">¿La olvidaste?</a>
              </div>
              <input name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Procesando...' : mode === 'password' ? 'Iniciar Sesión' : 'Enviar Enlace'}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo del Empleado</label>
            <input type="email" value={emailForPin} onChange={(e) => setEmailForPin(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código PIN de Acceso</label>
            <input type="password" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" required className="w-full text-center tracking-widest text-xl px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50">
            {loading ? 'Validando PIN...' : 'Ingresar a Terminal'}
          </button>
        </form>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">O continuar con</span></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => signInWithOAuth('google')} className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Google</button>
        <button onClick={() => signInWithOAuth('azure')} className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Microsoft</button>
      </div>
    </div>
  );
}