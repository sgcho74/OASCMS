'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Shield, Users as UsersIcon } from 'lucide-react';

export default function UserManagementPage() {
    const [isHydrated, setIsHydrated] = useState(false);
    const { currentUser, hasRole } = useAuthStore();

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    // Only System Admin can access
    if (!hasRole('system_admin')) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Access Denied</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        You do not have permission to access user management.
                    </p>
                </div>
            </div>
        );
    }

    const mockUsers = [
        { id: '1', username: 'admin', fullName: 'System Administrator', role: 'system_admin', email: 'admin@oascms.com' },
        { id: '2', username: 'sales', fullName: 'Sales Manager', role: 'sales_admin', email: 'sales@oascms.com' },
        { id: '3', username: 'governance', fullName: 'Governance Manager', role: 'governance_manager', email: 'governance@oascms.com' },
        { id: '4', username: 'customer', fullName: 'John Doe', role: 'customer', email: 'customer@example.com' },
    ];

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'system_admin':
                return <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">System Admin</span>;
            case 'sales_admin':
                return <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">Sales Admin</span>;
            case 'governance_manager':
                return <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">Governance Manager</span>;
            case 'customer':
                return <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">Customer</span>;
            default:
                return <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-200">{role}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage system users and roles</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{mockUsers.length}</dd>
                </div>
                <div className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {mockUsers.filter(u => u.role.includes('admin')).length}
                    </dd>
                </div>
                <div className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Managers</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {mockUsers.filter(u => u.role.includes('manager')).length}
                    </dd>
                </div>
                <div className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {mockUsers.filter(u => u.role === 'customer').length}
                    </dd>
                </div>
            </div>

            {/* User List */}
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600">
                                                <UsersIcon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">@{user.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            disabled
                                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex">
                    <UsersIcon className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">User Management</h3>
                        <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            This is a demo view. In production, you would be able to create, edit, and delete users, assign roles, and manage permissions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
