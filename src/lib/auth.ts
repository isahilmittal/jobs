
'use server';

import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '@/lib/types';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser extends User {
    role: UserRole;
}

// Ensure the super admin exists in Firestore on startup
export const ensureSuperAdminExists = async () => {
    const superAdminEmail = 'super@admin.com';
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", superAdminEmail));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("Super admin role not found in Firestore, creating placeholder...");
            // NOTE: This now only creates a placeholder document. 
            // The actual user must be created in the Firebase Console.
            // On first login, the application will associate the real UID with this role.
            await setDoc(doc(usersRef, 'super-admin-placeholder'), {
                email: superAdminEmail,
                role: 'SUPER_ADMIN',
                isPlaceholder: true,
            });
            console.log("Super admin placeholder created. Please create the user in Firebase Auth console if you haven't.");
        }
    } catch (error) {
        console.error("Error ensuring super admin exists:", error);
    }
};

export async function login(email: string, password: string): Promise<{ success: boolean; role?: UserRole; message?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userDocRef = doc(db, 'users', user.uid);
    let docSnap = await getDoc(userDocRef);

    let userRole: UserRole = 'ADMIN';

    // Special handling for the super admin
    if (user.email === 'super@admin.com') {
        userRole = 'SUPER_ADMIN';
        // If the user doc doesn't exist or is a placeholder, create/update it with the real UID
        if (!docSnap.exists() || docSnap.data().isPlaceholder) {
            await setDoc(userDocRef, { email: user.email, role: 'SUPER_ADMIN' });
            
            // Clean up the placeholder doc if it exists
            const placeholderRef = doc(db, 'users', 'super-admin-placeholder');
            const placeholderSnap = await getDoc(placeholderRef);
            if(placeholderSnap.exists()){
                await deleteDoc(placeholderRef);
            }
        }
    }

    // Now, get the definitive role from the user's document
    docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { success: true, role: data.role };
    } else {
      // For any other user logging in who doesn't have a doc, we'll create one as a regular admin.
      // In a production app, you might want a more robust invite system.
      await setDoc(userDocRef, { email: user.email, role: 'ADMIN' });
      return { success: true, role: 'ADMIN' };
    }
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    let message = "An unknown error occurred.";
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Invalid email or password. Please try again.";
    } else {
        message = error.message;
    }
    return { success: false, message };
  }
};

export async function logout(): Promise<void> {
    await signOut(auth);
};

export async function getCurrentUserWithRole(): Promise<{user: FirebaseUser; role: UserRole} | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return { user, role: (docSnap.data() as {role: UserRole}).role };
    }
    return null;
};

export async function getAllAdminUsers(): Promise<AdminUser[]> {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('isPlaceholder', '!=', true));
    const querySnapshot = await getDocs(q);
    const users: AdminUser[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
            uid: doc.id,
            email: data.email,
            role: data.role,
        });
    });
    return users;
}
