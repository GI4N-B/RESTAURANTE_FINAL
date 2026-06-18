'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logAttendanceAction } from '../api/hr-actions';

export function AttendanceTracker({ employeeId }: { employeeId: string }) {
  const [isClockedIn, setIsClockedIn] = useState(false);

  const handleAction = async () => {
    await logAttendanceAction(employeeId, isClockedIn ? 'CHECK_OUT' : 'CHECK_IN');
    setIsClockedIn(!isClockedIn);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800">Control de Asistencia</h3>
      <button 
        onClick={handleAction}
        className={`mt-4 w-full py-3 rounded-lg font-bold text-white transition ${isClockedIn ? 'bg-red-600' : 'bg-green-600'}`}
      >
        {isClockedIn ? 'Registrar Salida' : 'Registrar Entrada'}
      </button>
    </div>
  );
}