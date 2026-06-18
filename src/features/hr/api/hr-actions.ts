'use server';

import { createClient } from '@/lib/supabase/server';

export async function logAttendanceAction(employeeId: string, type: 'CHECK_IN' | 'CHECK_OUT') {
  const supabase = await createClient();
  const now = new Date().toISOString();

  if (type === 'CHECK_IN') {
    return await supabase.from('hr_attendance').insert({
      employee_id: employeeId,
      check_in: now,
      status: 'PRESENT'
    });
  } else {
    return await supabase
      .from('hr_attendance')
      .update({ check_out: now })
      .eq('employee_id', employeeId)
      .is('check_out', null); // Actualiza la entrada abierta del día
  }
}

export async function calculatePayrollAction(month: number, year: number) {
  const supabase = await createClient();
  // Lógica: Sumar salarios base + bonos - faltas (basado en hr_attendance)
  const { data, error } = await supabase.rpc('generate_payroll_for_month', { p_month: month, p_year: year });
  return { data, error };
}