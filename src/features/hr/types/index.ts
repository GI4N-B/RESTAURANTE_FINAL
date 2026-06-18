export interface Employee {
  id: string;
  full_name: string;
  email: string;
  position: { name: string; department: { name: string } };
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  hire_date: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'ON_LEAVE';
}