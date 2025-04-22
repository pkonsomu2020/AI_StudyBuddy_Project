
import { useEffect } from 'react';

type AuthView = 'login' | 'signup';

interface UseAuthDialogProps {
  onOpen: (view: AuthView) => void;
}

export function useAuthDialog({ onOpen }: UseAuthDialogProps) {
  useEffect(() => {
    const handleOpenAuthDialog = (event: CustomEvent<{ view: AuthView }>) => {
      onOpen(event.detail.view);
    };

    document.addEventListener('open-auth-dialog', handleOpenAuthDialog as EventListener);
    
    return () => {
      document.removeEventListener('open-auth-dialog', handleOpenAuthDialog as EventListener);
    };
  }, [onOpen]);
}
