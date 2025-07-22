
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.replace('/login');
        } else {
          setUser(currentUser);
          setIsLoading(false);
        }
      };
      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!user) {
        return null; // Should be redirected, but this is a fallback
    }

    return <WrappedComponent {...props} />;
  };
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthComponent;
};

export default withAuth;
