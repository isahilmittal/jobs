
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // onAuthStateChanged is the best way to listen for changes in auth state.
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          // User is signed in.
          setUser(currentUser);
        } else {
          // User is signed out.
          router.replace('/login'); // Use replace to avoid back-button issues
        }
        setIsLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [router]);

    // While we are checking for the user's auth state, show a loader.
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    // If there is no user, it means the redirect is happening or has happened.
    // Returning null prevents the wrapped component from rendering briefly.
    if (!user) {
      return null; 
    }

    // If we have a user, render the protected component.
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthComponent;
};

export default withAuth;
