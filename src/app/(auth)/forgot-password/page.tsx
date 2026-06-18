import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <ForgotPasswordForm />
    </div>
  );
}