'use client';

import { useState, useEffect } from 'react';
import { useContractStore } from '@/store/useContractStore';
import { AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';

export default function MigratePage() {
    const { contracts } = useContractStore();
    const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [migratedCount, setMigratedCount] = useState(0);

    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const needsMigration = contracts.filter(c => !c.paymentSchedules || c.paymentSchedules.length === 0);

    const runMigration = () => {
        setMigrationStatus('running');

        try {
            // Get current contracts from localStorage
            const stored = localStorage.getItem('oascms-contracts');
            if (!stored) {
                setMigrationStatus('error');
                return;
            }

            const data = JSON.parse(stored);
            let count = 0;

            // Migrate each contract
            const migratedContracts = data.state.contracts.map((contract: any) => {
                // Skip if already has paymentSchedules
                if (contract.paymentSchedules && contract.paymentSchedules.length > 0) {
                    return contract;
                }

                count++;

                // Generate payment schedules from total amount
                const totalAmount = contract.totalAmount;
                const baseDate = new Date(contract.createdAt);
                const schedules = [];

                // Deposit: 2 installments of 10% each
                for (let i = 1; i <= 2; i++) {
                    const dueDate = new Date(baseDate);
                    dueDate.setDate(dueDate.getDate() + (i - 1) * 7);
                    schedules.push({
                        id: crypto.randomUUID(),
                        stageType: 'Deposit',
                        installmentNo: i,
                        name: `선수금 ${i}차`,
                        dueDate: dueDate.toISOString().split('T')[0],
                        amount: totalAmount * 0.1,
                        status: 'pending',
                    });
                }

                // Progress: 4 installments of 10% each
                for (let i = 1; i <= 4; i++) {
                    const dueDate = new Date(baseDate);
                    dueDate.setMonth(dueDate.getMonth() + (i * 3));
                    schedules.push({
                        id: crypto.randomUUID(),
                        stageType: 'Progress',
                        installmentNo: i,
                        name: `중도금 ${i}차`,
                        dueDate: dueDate.toISOString().split('T')[0],
                        amount: totalAmount * 0.1,
                        status: 'pending',
                    });
                }

                // Final: 1 installment of 40%
                const finalDate = new Date(baseDate);
                finalDate.setMonth(finalDate.getMonth() + 18);
                schedules.push({
                    id: crypto.randomUUID(),
                    stageType: 'Final',
                    installmentNo: 1,
                    name: '잔금',
                    dueDate: finalDate.toISOString().split('T')[0],
                    amount: totalAmount * 0.4,
                    status: 'pending',
                });

                return {
                    ...contract,
                    paymentSchedules: schedules,
                    payments: contract.payments || [], // Keep legacy for compatibility
                };
            });

            // Save back to localStorage
            data.state.contracts = migratedContracts;
            localStorage.setItem('oascms-contracts', JSON.stringify(data));

            setMigratedCount(count);
            setMigrationStatus('success');

            // Reload page to pick up changes
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Migration error:', error);
            setMigrationStatus('error');
        }
    };

    if (!isHydrated) return null;

    return (
        <div className="mx-auto max-w-2xl space-y-6 py-12">
            <div className="text-center">
                <RefreshCcw className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Contract Migration</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Convert old contracts to the new payment schedule format
                </p>
            </div>

            {/* Status */}
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Contracts</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{contracts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Need Migration</span>
                        <span className={`text-lg font-bold ${needsMigration.length > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                            {needsMigration.length}
                        </span>
                    </div>
                </div>

                {needsMigration.length > 0 && migrationStatus === 'idle' && (
                    <div className="mt-6">
                        <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Migration Required</h3>
                                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                        <p>
                                            {needsMigration.length} contract(s) are using the old payment format.
                                            Click the button below to migrate them to the new payment schedule system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={runMigration}
                            className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <RefreshCcw className="mr-2 inline h-4 w-4" />
                            Run Migration
                        </button>
                    </div>
                )}

                {migrationStatus === 'running' && (
                    <div className="mt-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-center">
                            <RefreshCcw className="h-5 w-5 animate-spin text-blue-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Migration in Progress</h3>
                                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                    Please wait while we update your contracts...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {migrationStatus === 'success' && (
                    <div className="mt-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="flex">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Migration Complete!</h3>
                                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                    Successfully migrated {migratedCount} contract(s). The page will reload automatically...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {migrationStatus === 'error' && (
                    <div className="mt-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Migration Failed</h3>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    An error occurred during migration. Please try again or contact support.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {needsMigration.length === 0 && migrationStatus === 'idle' && (
                    <div className="mt-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="flex">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">All Up to Date</h3>
                                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                    All contracts are using the new payment schedule format. No migration needed!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">What does migration do?</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Converts legacy payment arrays to the new payment schedule system</li>
                    <li>Generates 7 payment schedules per contract (Deposit, Progress, Final)</li>
                    <li>Preserves all existing contract data</li>
                    <li>Automatically reloads the page when complete</li>
                </ul>
            </div>
        </div>
    );
}
