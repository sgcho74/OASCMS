'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(username, password);

        if (success) {
            router.push('/ko'); // Redirect to dashboard
        } else {
            setError('Invalid username or password');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo/Header */}
                <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        OASCMS
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-lg bg-white/10 backdrop-blur-lg p-8 shadow-2xl">
                        {error && (
                            <div className="rounded-md bg-red-500/20 p-3">
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-red-300" />
                                    <p className="ml-3 text-sm text-red-200">{error}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                                Username
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/20 py-3 pl-10 pr-3 text-white placeholder-gray-400 backdrop-blur-sm focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/20 py-3 pl-10 pr-3 text-white placeholder-gray-400 backdrop-blur-sm focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    {/* Demo Credentials */}
                    <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                        <p className="mb-2 text-xs font-medium text-gray-300">Demo Accounts:</p>
                        <div className="space-y-1 text-xs text-gray-400">
                            <p>• <span className="font-mono">admin / admin123</span> (System Admin)</p>
                            <p>• <span className="font-mono">sales / sales123</span> (Sales Admin)</p>
                            <p>• <span className="font-mono">governance / gov123</span> (Governance Manager)</p>
                            <p>• <span className="font-mono">customer / customer123</span> (Customer)</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
