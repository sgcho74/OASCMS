'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function UserMenu() {
    const { currentUser, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    if (!isAuthenticated || !currentUser) return null;

    const handleLogout = () => {
        logout();
        router.push('/ko/login');
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'system_admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'sales_admin':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'governance_manager':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'customer':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'system_admin': return 'System Admin';
            case 'sales_admin': return 'Sales Admin';
            case 'governance_manager': return 'Governance Manager';
            case 'customer': return 'Customer';
            default: return role;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 rounded-lg bg-gray-800 px-3 py-2 text-sm hover:bg-gray-700"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                    <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                    <p className="font-medium text-white">{currentUser.fullName}</p>
                    <p className="text-xs text-gray-400">@{currentUser.username}</p>
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
                        <div className="border-b border-gray-700 p-4">
                            <p className="font-medium text-white">{currentUser.fullName}</p>
                            <p className="text-sm text-gray-400">{currentUser.email}</p>
                            <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(currentUser.role)}`}>
                                <Shield className="mr-1 h-3 w-3" />
                                {getRoleLabel(currentUser.role)}
                            </span>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
