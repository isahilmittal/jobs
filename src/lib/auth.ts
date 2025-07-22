
'use server';

import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    deleteUser as deleteFbUser,
    type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '@/lib/types';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser extends User {
    role: UserRole;
}

// Ensure the super admin exists in Firestore on startup
export const ensureSuperAdminExists = async () => {
    const superAdminEmail = 'super@admin.com';
    const userDocRef = doc(db, 'users', 'super-admin-uid'); // Use a predictable ID

    try {
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            console.log("Super admin not found, creating...");
            // Note: This only creates the Firestore record. 
            // The actual Firebase Auth user must be created manually in the Firebase Console
            // with email `super@admin.com` and a password of your choice.
            // The UID from the console should be used as 'super-admin-uid'.
            await setDoc(userDocRef, {
                email: superAdminEmail,
                role: 'SUPER_ADMIN',
            });
            console.log("Super admin Firestore record created. Please create the user in Firebase Auth console.");
        }
    } catch (error) {
        console.error("Error ensuring super admin exists:", error);
    }
};

// Call this on server start, e.g. in a layout or a dedicated init file.
ensureSuperAdminExists();


export async function login(email: string, password: string): Promise<{ success: boolean; role?: UserRole; message?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as { role: UserRole };
      return { success: true, role: data.role };
    } else {
      await signOut(auth);
      return { success: false, message: 'User role not found.' };
    }
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    return { success: false, message: error.message || "An unknown error occurred." };
  }
};

export async function logout(): Promise<void> {
    await signOut(auth);
};

export async function getCurrentUser(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

export async function getCurrentUserWithRole(): Promise<{user: FirebaseUser; role: UserRole} | null> {
    const user = await getCurrentUser();
    if (!user) return null;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return { user, role: (docSnap.data() as {role: UserRole}).role };
    }
    return null;
}

export async function addAdminUser(email: string, password: string): Promise<{success: boolean, message: string}> {
    try {
        // This is tricky without a backend context to run admin SDK
        // For client-side, we can't create users and set claims directly.
        // We'll create the user and add their role to Firestore.
        // This relies on security rules to protect the 'users' collection.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'ADMIN'
        });

        return { success: true, message: 'Admin user created successfully.'};
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteAdminUser(uid: string): Promise<{success: boolean, message: string}> {
     // This is not possible from the client-side SDK directly for security reasons.
     // This would typically be an admin SDK call from a secure backend.
     // For this project, we'll just delete their role doc. The user will remain in Auth.
    try {
        const userDocRef = doc(db, 'users', uid);
        await deleteDoc(userDocRef);
        return { success: true, message: 'Admin user role deleted. The user must be deleted from the Auth console.' };
    } catch (error: any) {
         return { success: false, message: error.message };
    }
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
    const usersCollectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);
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
