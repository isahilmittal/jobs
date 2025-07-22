
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
            // Note: This only creates a placeholder document to indicate the role.
            // The actual Firebase Auth user must be created manually in the Firebase Console
            // with the email `super@admin.com`.
            // When that user logs in, their real UID will be used.
            // We create this document so other logic knows this email has special permissions.
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
    
    // On successful login, ensure their user document and role are correctly set up.
    const userDocRef = doc(db, 'users', user.uid);
    let docSnap = await getDoc(userDocRef);

    let userRole: UserRole = 'ADMIN'; // Default role for new users

    if (user.email === 'super@admin.com') {
        userRole = 'SUPER_ADMIN';
        if (!docSnap.exists() || docSnap.data().isPlaceholder) {
            await setDoc(userDocRef, { email: user.email, role: 'SUPER_ADMIN' });
            // Check for and remove the placeholder if it exists
            const placeholderRef = doc(db, 'users', 'super-admin-placeholder');
            if((await getDoc(placeholderRef)).exists()){
                await deleteDoc(placeholderRef);
            }
        }
    }

    docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as { role: UserRole };
      return { success: true, role: data.role };
    } else {
      // This case is for regular admins who are not the super admin.
      // We'll create their record on first login.
      // This part might need more robust logic in a real app, e.g. an invite system.
      await setDoc(userDocRef, { email: user.email, role: 'ADMIN' });
      return { success: true, role: 'ADMIN' };
    }
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    const errorCode = error.code;
    let message = "An unknown error occurred.";
    if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
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

// This function is for SUPER_ADMINS to create new ADMIN users.
export async function addAdminUser(email: string, password: string): Promise<{success: boolean, message: string}> {
    // IMPORTANT: This function creates a user in Firebase Auth.
    // The role document in Firestore is created automatically on their first login.
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // We set their role in Firestore immediately upon creation.
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'ADMIN'
        });

        return { success: true, message: 'Admin user created successfully.'};
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: 'This email address is already in use.' };
        }
        return { success: false, message: error.message };
    }
}

export async function deleteAdminUser(uid: string): Promise<{success: boolean, message: string}> {
     // This is not possible from the client-side SDK directly for security reasons.
     // This would typically be an admin SDK call from a secure backend.
     // For this project, we'll just delete their role doc from Firestore. 
     // The user will remain in Firebase Auth and must be deleted from the console.
    try {
        const currentUser = await getCurrentUserWithRole();
        if (currentUser?.role !== 'SUPER_ADMIN') {
            return { success: false, message: 'You do not have permission to delete users.' };
        }
        if (currentUser.user.uid === uid) {
            return { success: false, message: "You cannot delete your own account."};
        }

        const userDocRef = doc(db, 'users', uid);
        await deleteDoc(userDocRef);
        return { success: true, message: 'Admin user role deleted. The user must be manually deleted from the Authentication console.' };
    } catch (error: any) {
         return { success: false, message: error.message };
    }
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
    const usersCollectionRef = collection(db, 'users');
    // Filter out the placeholder account
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
