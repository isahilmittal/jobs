
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // onAuthStateChanged returns an unsubscribe function that we can call on cleanup
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          // If the user is not logged in, redirect to the login page.
          router.push('/login');
        } else {
          // If the user is logged in, we are no longer loading.
          setIsLoading(false);
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [router]);

    // While we are verifying the user's authentication state, show a loader.
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    // If we are no longer loading and a user exists, render the wrapped component.
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthComponent;
};

export default withAuth;
