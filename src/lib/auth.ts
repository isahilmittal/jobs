
'use server';

import { auth } from '@/lib/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    type User
} from 'firebase/auth';
// Firestore imports are removed as we are not using the database for roles anymore.
// import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where, writeBatch, serverTimestamp } from 'firebase/firestore';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
    uid: string;
    email: string;
    role: UserRole;
}

// Mocking user roles since Firestore is removed.
const getUserRole = async (uid: string): Promise<UserRole | null> => {
    // For demonstration, all logged-in users are treated as SUPER_ADMIN.
    // In a real scenario, this would check against a database.
    if (uid) {
        return 'SUPER_ADMIN';
    }
    return null;
}

// This function is no longer needed as we are not setting roles in a DB.
// const setUserRole = async (uid: string, email: string, role: UserRole) => { ... }

export const ensureSuperAdminExists = async () => {
    const superAdminEmail = 'super@admin.com';
    const superAdminPassword = 'password';

    try {
        // Attempt to sign in to see if the user exists. This is a common workaround.
        // We will sign out immediately after.
        const userCredential = await signInWithEmailAndPassword(auth, superAdminEmail, superAdminPassword);
        await signOut(auth); // Sign out immediately
        console.log('Super admin already exists.');
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            // User does not exist, so create them
            try {
                await createUserWithEmailAndPassword(auth, superAdminEmail, superAdminPassword);
                console.log('Super admin user created successfully.');
                await signOut(auth); // Sign out after creation
            } catch (createError: any) {
                console.error('Error creating super admin:', createError);
            }
        } else {
            // Another error occurred during the check
            console.error('Error checking for super admin:', error);
        }
    }
};

export const addAdminUser = async (email: string, password: string): Promise<{success: boolean, message: string}> => {
    // This now only creates a user in Firebase Auth, without assigning a role in a database.
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, message: 'User created in Firebase Auth. Role management is disabled.'};
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: 'This email is already in use in Firebase Authentication.' };
        }
        console.error("Error adding user:", error);
        return { success: false, message: error.message };
    }
}

export const deleteAdminUser = async (uid: string): Promise<{success: boolean, message: string}> => {
    // This function now only returns a message, as roles are not stored.
    return { success: true, message: 'Role management is disabled. Please delete the user from Firebase Authentication console.'};
}

export const login = async (email: string, password: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Since Firestore is removed, we'll just return a SUPER_ADMIN role for any logged-in user.
    const role = await getUserRole(user.uid);
    if (role) {
        return { success: true, role };
    } else {
        await signOut(auth);
        return { success: false, message: 'Could not determine user role.' };
    }
  } catch(error: any) {
    return { success: false, message: "Invalid email or password." };
  }
};

export async function logout(): Promise<void> {
    return signOut(auth);
};

export async function getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        });
    });
};

export async function getCurrentUserWithRole(): Promise<{user: User; role: UserRole} | null> {
    const user = await getCurrentUser();
    if (user) {
        // All logged-in users are treated as SUPER_ADMIN for now.
        const role = await getUserRole(user.uid);
        if (role) {
            return { user, role };
        }
    }
    return null;
}


export async function getAllAdminUsers(): Promise<Omit<AdminUser, 'password'>[]> {
    // Returning an empty array as we can't query roles from Firestore.
    console.log("Firestore is disconnected. Cannot fetch admin users.");
    return [];
}
