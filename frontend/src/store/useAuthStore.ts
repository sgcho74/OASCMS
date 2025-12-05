import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'customer' | 'sales_admin' | 'governance_manager' | 'system_admin';

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: UserRole;
    customerId?: string; // For customer role only - links to their contract/reservation
    createdAt: string;
    lastLogin?: string;
}

interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: UserRole | UserRole[]) => boolean;
    setHydrated: () => void;
}

// Mock user database (in production, this would be API calls)
const MOCK_USERS: { [username: string]: { password: string; user: User } } = {
    admin: {
        password: 'admin123',
        user: {
            id: 'user-1',
            username: 'admin',
            email: 'admin@oascms.com',
            fullName: 'System Administrator',
            role: 'system_admin',
            createdAt: new Date().toISOString(),
        },
    },
    sales: {
        password: 'sales123',
        user: {
            id: 'user-2',
            username: 'sales',
            email: 'sales@oascms.com',
            fullName: 'Sales Manager',
            role: 'sales_admin',
            createdAt: new Date().toISOString(),
        },
    },
    governance: {
        password: 'gov123',
        user: {
            id: 'user-3',
            username: 'governance',
            email: 'governance@oascms.com',
            fullName: 'Governance Manager',
            role: 'governance_manager',
            createdAt: new Date().toISOString(),
        },
    },
    customer: {
        password: 'customer123',
        user: {
            id: 'user-4',
            username: 'customer',
            email: 'customer@example.com',
            fullName: 'John Doe',
            role: 'customer',
            customerId: 'cust-001',
            createdAt: new Date().toISOString(),
        },
    },
};

// Permission matrix
const PERMISSIONS: { [key: string]: UserRole[] } = {
    // Leads
    'leads:read': ['sales_admin', 'governance_manager', 'system_admin'],
    'leads:write': ['sales_admin', 'system_admin'],
    'leads:delete': ['system_admin'],

    // Contracts
    'contracts:read': ['customer', 'sales_admin', 'governance_manager', 'system_admin'],
    'contracts:write': ['sales_admin', 'system_admin'],
    'contracts:delete': ['system_admin'],

    // Reservations
    'reservations:read': ['customer', 'sales_admin', 'governance_manager', 'system_admin'],
    'reservations:write': ['sales_admin', 'system_admin'],
    'reservations:delete': ['sales_admin', 'system_admin'],

    // Units & Inventory
    'units:read': ['sales_admin', 'governance_manager', 'system_admin'],
    'units:write': ['system_admin'],
    'units:delete': ['system_admin'],

    // Projects
    'projects:read': ['sales_admin', 'governance_manager', 'system_admin'],
    'projects:write': ['system_admin'],
    'projects:delete': ['system_admin'],

    // Payments
    'payments:read': ['customer', 'sales_admin', 'governance_manager', 'system_admin'],
    'payments:write': ['sales_admin', 'system_admin'],

    // Lottery
    'lottery:read': ['sales_admin', 'governance_manager', 'system_admin'],
    'lottery:write': ['sales_admin', 'system_admin'],

    // Import/Export
    'export:data': ['governance_manager', 'system_admin'],
    'import:data': ['system_admin'],

    // User Management
    'users:read': ['system_admin'],
    'users:write': ['system_admin'],
    'users:delete': ['system_admin'],

    // Dashboard
    'dashboard:analytics': ['sales_admin', 'governance_manager', 'system_admin'],
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            currentUser: null,
            isAuthenticated: false,
            isHydrated: false,

            setHydrated: () => set({ isHydrated: true }),

            login: (username: string, password: string) => {
                const userRecord = MOCK_USERS[username.toLowerCase()];

                if (userRecord && userRecord.password === password) {
                    const user = {
                        ...userRecord.user,
                        lastLogin: new Date().toISOString(),
                    };

                    set({ currentUser: user, isAuthenticated: true });
                    return true;
                }

                return false;
            },

            logout: () => {
                set({ currentUser: null, isAuthenticated: false });
            },

            hasPermission: (permission: string) => {
                const { currentUser } = get();
                if (!currentUser) return false;

                const allowedRoles = PERMISSIONS[permission];
                if (!allowedRoles) return false;

                return allowedRoles.includes(currentUser.role);
            },

            hasRole: (role: UserRole | UserRole[]) => {
                const { currentUser } = get();
                if (!currentUser) return false;

                if (Array.isArray(role)) {
                    return role.includes(currentUser.role);
                }

                return currentUser.role === role;
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
