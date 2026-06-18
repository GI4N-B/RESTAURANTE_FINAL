import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SaaS RestoEnterprise</h1>
        <p className="mt-2 text-sm text-gray-600">Control de operaciones y terminales POS</p>
      </div>
      <LoginForm />
    </div>
  );
}