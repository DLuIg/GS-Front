// app/hocs/withAuth.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { useAuth } from '../contexts/authContext'; // Ajuste o caminho

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WrapperComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/'); // Redireciona para a Home (Login)
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Carregando...</p> {/* Ou um componente de Spinner */}
        </div>
      );
    }
    return <WrappedComponent {...props} />;
  };
  WrapperComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WrapperComponent;
};

export default withAuth;