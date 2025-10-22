import { User } from '../types';

// In a real app, this would be a secure, server-side user object.
// Here we include the password hash for local simulation.
export interface StoredUser extends User {
    passwordHash: string;
    bannerUrl?: string;
}

const ALL_USERS_KEY = 'nexus_all_users';
const CURRENT_USER_KEY = 'nexus_current_user';

// === All Users Database ===
export const getUsers = (): StoredUser[] => {
    try {
        const users = localStorage.getItem(ALL_USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

export const saveUsers = (users: StoredUser[]): void => {
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
};

// === Current User Session ===
export const getCurrentUser = (): User | null => {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Failed to parse current user from localStorage", error);
        return null;
    }
};

export const saveCurrentUser = (user: User): void => {
    // We only store the safe User object in the session, not the password hash.
    const { passwordHash, ...safeUser } = user as StoredUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
};

export const clearCurrentUser = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};
