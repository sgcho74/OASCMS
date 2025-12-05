'use client';

import { useAuthStore } from '@/store/useAuthStore';

interface PermissionGateProps {
    permission: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export default function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
    const { hasPermission } = useAuthStore();

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Hook to check permissions programmatically
 */
export function usePermission(permission: string): boolean {
    const { hasPermission } = useAuthStore();
    return hasPermission(permission);
}

/**
 * Hook to check if user has specific role(s)
 */
export function useRole(role: string | string[]): boolean {
    const { hasRole } = useAuthStore();
    return hasRole(role as any);
}
