

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
    email: string;
    password: string;
    role: UserRole;
}

// In a real application, this would be a database.
// For this demo, we'll store users in localStorage.
const getUsers = (): AdminUser[] => {
    if (typeof window === 'undefined') {
        return [
            { email: 'sahil@analyzed.com', password: '3945@SahilM', role: 'SUPER_ADMIN' },
            { email: 'admin@example.com', password: 'password123', role: 'ADMIN' },
            { email: 'manager@example.com', password: 'password456', role: 'ADMIN' },
        ];
    }
    const users = localStorage.getItem('admin_users');
    if (users) {
        return JSON.parse(users);
    }
    const initialUsers = [
        { email: 'sahil@analyzed.com', password: '3945@SahilM', role: 'SUPER_ADMIN' },
        { email: 'admin@example.com', password: 'password123', role: 'ADMIN' },
        { email: 'manager@example.com', password: 'password456', role: 'ADMIN' },
    ];
    localStorage.setItem('admin_users', JSON.stringify(initialUsers));
    return initialUsers;
}

const setUsers = (users: AdminUser[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('admin_users', JSON.stringify(users));
    }
}

export const addAdminUser = (newUser: AdminUser): {success: boolean, message: string} => {
    const users = getUsers();
    if (users.find(u => u.email === newUser.email)) {
        return { success: false, message: 'User with this email already exists.' };
    }
    setUsers([...users, newUser]);
    return { success: true, message: 'Admin user added successfully.'};
}

export const deleteAdminUser = (email: string): {success: boolean, message: string} => {
    let users = getUsers();
    const userToDelete = users.find(u => u.email === email);
    if (!userToDelete) {
        return { success: false, message: 'User not found.' };
    }
    if (userToDelete.role === 'SUPER_ADMIN') {
        return { success: false, message: 'Cannot delete a super admin.' };
    }
    users = users.filter(u => u.email !== email);
    setUsers(users);
    return { success: true, message: 'Admin user deleted successfully.'};
}


const AUTH_KEY = 'job-board-auth';

export interface AuthData {
    email: string;
    role: UserRole;
    loggedInAt: string;
}

export const login = (email: string, password: string): boolean => {
  const users = getUsers();
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ email: user.email, role: user.role, loggedInAt: new Date().toISOString() }));
    }
    return true;
  }

  return false;
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;
    return true;
  }
  return false;
};

export const getAuthenticatedUser = (): AuthData | null => {
    if (typeof window !== 'undefined') {
        const authData = localStorage.getItem(AUTH_KEY);
        if (authData) {
            return JSON.parse(authData) as AuthData;
        }
    }
    return null;
}

export const getAllAdminUsers = (): Omit<AdminUser, 'password'>[] => {
    return getUsers().map(({password, ...user}) => user);
}
