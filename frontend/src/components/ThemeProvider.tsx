'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const isDarkMode = useThemeStore((state) => state.isDarkMode);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Enforce dark mode
        root.classList.remove('light');
        root.classList.add('dark');
        
        // We can keep the store sync if needed, or just ignore it
    }, []); // Run once on mount

    // Prevent hydration mismatch by rendering nothing until mounted
    // OR render children but avoid applying theme-dependent classes here directly
    // Since we're applying classes to <html>, rendering children is fine.
    
    return <>{children}</>;
}
