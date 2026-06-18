'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function PayrollDashboard() {
  const supabase = createClient();

  const { data: payroll, isLoading } = useQuery({
    queryKey: ['payroll-summary'],
    queryFn: async () => {
      const { data } = await supabase.from('hr_payroll_records').select('*, employee:hr_employees(full_name)');
      return data;
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Empleado</th>
            <th className="p-3">Sueldo Base</th>
            <th className="p-3">Días Trabajados</th>
            <th className="p-3">Neto a Pagar</th>
          </tr>
        </thead>
        <tbody>
          {payroll?.map((row) => (
            <tr key={row.id} className="border-b">
              <td className="p-3 font-medium">{row.employee.full_name}</td>
              <td className="p-3">${row.base_salary}</td>
              <td className="p-3">{row.days_worked}</td>
              <td className="p-3 font-bold text-green-700">${row.net_salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}