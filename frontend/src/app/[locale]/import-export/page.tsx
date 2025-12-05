'use client';

import { useState, useEffect } from 'react';
import ExportPanel from '@/components/import-export/ExportPanel';
import ImportPanel from '@/components/import-export/ImportPanel';

export default function ImportExportPage() {
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Import & Export</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Backup your data or migrate between environments
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('export')}
                        className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'export'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        Export Data
                    </button>
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'import'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        Import Data
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'export' && <ExportPanel />}
                {activeTab === 'import' && <ImportPanel />}
            </div>
        </div>
    );
}
