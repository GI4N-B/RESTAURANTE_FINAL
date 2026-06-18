import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createUserAction, updateUserAction, deleteUserAction, 
  suspendUserAction, resetPasswordAction, changePinAction 
} from './server-actions';
import { UserFormData } from '../validations/user-schemas';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => createUserAction(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) => updateUserAction(id, data),
    onSuccess: invalidate,
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, suspend }: { id: string; suspend: boolean }) => suspendUserAction(id, suspend),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserAction(id),
    onSuccess: invalidate,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, pass }: { id: string; pass: string }) => resetPasswordAction(id, pass),
  });

  const changePinMutation = useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: string }) => changePinAction(id, pin),
  });

  return {
    create: createMutation,
    update: updateMutation,
    suspend: suspendMutation,
    delete: deleteMutation,
    resetPassword: resetPasswordMutation,
    changePin: changePinMutation,
  };
};