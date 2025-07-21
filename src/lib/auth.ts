
'use server';

import { auth, db } from '@/lib/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where, writeBatch } from 'firebase/firestore';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
    uid: string;
    email: string;
    role: UserRole;
}

// Helper to get user role
const getUserRole = async (uid: string): Promise<UserRole | null> => {
    const userRoleDoc = await getDoc(doc(db, "userRoles", uid));
    if (userRoleDoc.exists()) {
        return userRoleDoc.data().role as UserRole;
    }
    return null;
}

// Helper to set user role
const setUserRole = async (uid: string, email: string, role: UserRole) => {
    await setDoc(doc(db, "userRoles", uid), { email, role });
}

// Ensure SUPER_ADMIN exists on first run
export const ensureSuperAdminExists = async () => {
    const superAdminEmail = 'sahil@analyzed.com';
    const rolesCollectionRef = collection(db, "userRoles");
    const q = query(rolesCollectionRef, where("email", "==", superAdminEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.warn(`
            Creating SUPER_ADMIN role for ${superAdminEmail}. 
            IMPORTANT: You must manually create this user in Firebase Authentication 
            with the email ${superAdminEmail} and password '3945@SahilM' for login to work.
        `);

        // This is a placeholder to create the role document.
        // The UID will be incorrect until the user is created in Firebase Auth and logs in once.
        // A more robust solution would involve a Cloud Function triggered on user creation.
        const batch = writeBatch(db);
        const placeholderDoc = doc(collection(db, "placeholdersForSuperAdmin"));
        batch.set(placeholderDoc, { email: superAdminEmail, role: 'SUPER_ADMIN', createdAt: new Date() });
        await batch.commit();
    }
}

export const addAdminUser = async (email: string, password: string): Promise<{success: boolean, message: string}> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setUserRole(user.uid, user.email!, 'ADMIN');
        return { success: true, message: 'Admin user added successfully.'};
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: 'User with this email already exists.' };
        }
        return { success: false, message: error.message };
    }
}

export const deleteAdminUser = async (uid: string): Promise<{success: boolean, message: string}> => {
    try {
        const role = await getUserRole(uid);
        if (role === 'SUPER_ADMIN') {
             return { success: false, message: 'Cannot delete a super admin.' };
        }
        await deleteDoc(doc(db, "userRoles", uid));
        // Note: This only removes the role from Firestore. The user must be deleted from Firebase Auth separately.
        return { success: true, message: 'Admin user role deleted. Remember to delete the user from Firebase Authentication.'};
    } catch (error: any) {
         return { success: false, message: error.message };
    }
}

export const login = async (email: string, password: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Special handling for the super admin on first login
    if (email === 'sahil@analyzed.com') {
      const currentRole = await getUserRole(user.uid);
      if (!currentRole) {
        console.log(`Assigning SUPER_ADMIN role to ${email}`);
        await setUserRole(user.uid, user.email!, 'SUPER_ADMIN');
      }
    }

    const role = await getUserRole(user.uid);
    if (role) {
        return { success: true, role };
    } else {
        await signOut(auth);
        return { success: false, message: 'User is not an administrator.' };
    }
  } catch(error: any) {
    // console.error("Login error:", error);
    return { success: false, message: "Invalid email or password." };
  }
};

export const logout = async (): Promise<void> => {
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
        const role = await getUserRole(user.uid);
        if (role) {
            return { user, role };
        }
    }
    return null;
}


export async function getAllAdminUsers(): Promise<Omit<AdminUser, 'password'>[]> {
    const rolesSnapshot = await getDocs(collection(db, "userRoles"));
    const users = rolesSnapshot.docs
        .map(doc => ({
            uid: doc.id,
            email: doc.data().email,
            role: doc.data().role,
        }))
        .filter(user => user.role === 'ADMIN'); // Only return normal admins
    return users;
}

    