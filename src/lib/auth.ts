
const ADMIN_USERS = [
  { email: 'admin@example.com', password: 'password123' },
  { email: 'manager@example.com', password: 'password456' },
];

const AUTH_KEY = 'job-board-auth';

export const login = (email: string, password: string): boolean => {
  const user = ADMIN_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ email: user.email, loggedInAt: new Date().toISOString() }));
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
    
    // Optional: Add session expiry logic here if needed
    // const { loggedInAt } = JSON.parse(authData);
    // const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
    // if (new Date().getTime() - new Date(loggedInAt).getTime() > sessionDuration) {
    //   logout();
    //   return false;
    // }

    return true;
  }
  return false;
};
