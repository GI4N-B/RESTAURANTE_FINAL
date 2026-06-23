import { useCallback } from 'react';
import { useToast } from '@/providers/toaster-provider';

export function useToastError() {
  const toast = useToast();

  const handleError = useCallback(
    (error: unknown, defaultMessage = 'Ocurrió un error') => {
      let message = defaultMessage;

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      toast.error(message);
    },
    [toast]
  );

  return { handleError };
}
