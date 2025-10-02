// Authentication utilities
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

const AUTH_STORAGE_KEY = 'iit_prep_auth';
const USERS_STORAGE_KEY = 'iit_prep_users';

export const getCurrentUser = (): User | null => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const saveCurrentUser = (user: User): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const getUsers = (): Record<string, { password: string; user: User }> => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  } catch (error) {
    console.error('Error getting users:', error);
    return {};
  }
};

const saveUsers = (users: Record<string, { password: string; user: User }>): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const login = async (credentials: AuthCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
  const { email, password } = credentials;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getUsers();
  const userRecord = users[email];
  
  if (!userRecord || userRecord.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }
  
  saveCurrentUser(userRecord.user);
  return { success: true, user: userRecord.user };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { valid: errors.length === 0, errors };
};