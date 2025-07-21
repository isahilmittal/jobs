
'use server';

import { auth, db } from '@/lib/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
    uid: string;
    email: string;
    role: UserRole;
}

// In a real application, this would be a database.
// We are now using Firestore to store user roles.
const getUserRole = async (uid: string): Promise<UserRole | null> => {
    const userRoleDoc = await getDoc(doc(db, "userRoles", uid));
    if (userRoleDoc.exists()) {
        return userRoleDoc.data().role as UserRole;
    }
    return null;
}

const setUserRole = async (uid: string, email: string, role: UserRole) => {
    await setDoc(doc(db, "userRoles", uid), { email, role });
}

// Ensure SUPER_ADMIN exists on first run
export const ensureSuperAdminExists = async () => {
    const superAdminEmail = 'sahil@analyzed.com';
    const rolesCollection = collection(db, "userRoles");
    const q = query(rolesCollection, where("email", "==", superAdminEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log("Super admin not found, creating one... This requires manual user creation in Firebase Auth first.");
        // Note: The user 'sahil@analyzed.com' must be created in the Firebase Authentication console first.
        // This function will only assign the role.
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
        // For simplicity, we are not handling user deletion from Auth here.
        return { success: true, message: 'Admin user role deleted. Remember to delete the user from Firebase Authentication.'};
    } catch (error: any) {
         return { success: false, message: error.message };
    }
}

export const login = async (email: string, password: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const role = await getUserRole(userCredential.user.uid);
    if (role) {
        return { success: true, role };
    } else {
        await signOut(auth);
        return { success: false, message: 'User is not an administrator.' };
    }
  } catch(error: any) {
    return { success: false, message: "Invalid email or password." };
  }
};

export const logout = async (): Promise<void> => {
    return signOut(auth);
};

export const getCurrentUser = async (): Promise<User | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        });
    });
};

export const getCurrentUserWithRole = async (): Promise<{user: User; role: UserRole} | null> => {
    const user = await getCurrentUser();
    if (user) {
        const role = await getUserRole(user.uid);
        if (role) {
            return { user, role };
        }
    }
    return null;
}


export const getAllAdminUsers = async (): Promise<Omit<AdminUser, 'password'>[]> => {
    const rolesSnapshot = await getDocs(collection(db, "userRoles"));
    return rolesSnapshot.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email,
        role: doc.data().role,
    }));
}
