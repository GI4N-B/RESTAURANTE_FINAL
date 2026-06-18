import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <ResetPasswordForm />
    </div>
  );
}