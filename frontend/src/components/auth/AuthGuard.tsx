'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isHydrated } = useAuthStore();

    useEffect(() => {
        // Allow public routes
        if (pathname.includes('/login')) {
            return;
        }

        // Wait for hydration to finish before checking auth
        if (!isHydrated) {
            return;
        }

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            const locale = pathname.split('/')[1] || 'ko';
            router.push(`/${locale}/login`);
        }
    }, [isAuthenticated, isHydrated, pathname, router]);

    // Show nothing while checking auth or hydrating (prevents flash of content)
    if ((!isHydrated || !isAuthenticated) && !pathname.includes('/login')) {
        return null;
    }

    return <>{children}</>;
}
