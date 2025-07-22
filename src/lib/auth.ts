
'use server';

import type { User } from '@/lib/types';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser extends User {
    role: UserRole;
}

// In-memory array to store users since Firebase is disconnected.
const memoryUsers: AdminUser[] = [
    {
        uid: 'super-admin-01',
        email: 'super@admin.com',
        password: 'password', // In a real app, this would be hashed.
        role: 'SUPER_ADMIN',
    },
    {
        uid: 'admin-01',
        email: 'admin@example.com',
        password: 'password',
        role: 'ADMIN',
    }
];

// Simple session management
let currentUser: AdminUser | null = null;


export async function login(email: string, password: string): Promise<{ success: boolean; role?: UserRole; message?: string }> {
  const user = memoryUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    return { success: true, role: user.role };
  }
  
  return { success: false, message: "Invalid email or password." };
};

export async function logout(): Promise<void> {
    currentUser = null;
    return Promise.resolve();
};

export async function getCurrentUser(): Promise<User | null> {
    return Promise.resolve(currentUser ? { uid: currentUser.uid, email: currentUser.email } : null);
};

export async function getCurrentUserWithRole(): Promise<{user: User; role: UserRole} | null> {
    if (currentUser) {
        return Promise.resolve({ user: { uid: currentUser.uid, email: currentUser.email }, role: currentUser.role });
    }
    return Promise.resolve(null);
}

export async function addAdminUser(email: string, password: string): Promise<{success: boolean, message: string}> {
    if (memoryUsers.some(u => u.email === email)) {
        return { success: false, message: 'This email is already in use.' };
    }
    const newUser: AdminUser = {
        uid: `admin-${Date.now()}`,
        email,
        password,
        role: 'ADMIN',
    };
    memoryUsers.push(newUser);
    return { success: true, message: 'Admin user added successfully.'};
}

export async function deleteAdminUser(uid: string): Promise<{success: boolean, message: string}> {
    const index = memoryUsers.findIndex(u => u.uid === uid);
    if (index > -1) {
        if (memoryUsers[index].role === 'SUPER_ADMIN') {
            return { success: false, message: 'Cannot delete the super admin.' };
        }
        memoryUsers.splice(index, 1);
        return { success: true, message: 'Admin user deleted.' };
    }
    return { success: false, message: 'User not found.' };
}

export async function getAllAdminUsers(): Promise<Omit<AdminUser, 'password'>[]> {
    return Promise.resolve(
        memoryUsers.map(({ password, ...user }) => user)
    );
}

// This function is no longer needed but kept to avoid breaking imports.
export const ensureSuperAdminExists = async () => {
    console.log("Super admin is initialized in memory.");
};
