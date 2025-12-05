import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { parseFile, restoreFullBackup } from '@/lib/export-utils';

export default function ImportPanel() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importType, setImportType] = useState<'backup' | 'entity'>('backup');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError('');
            setSuccess('');
        }
    };

    const handleImportBackup = async () => {
        if (!selectedFile) return;

        try {
            const data = await parseFile(selectedFile);
            const restoredCount = restoreFullBackup(data);
            setSuccess(`Successfully restored ${restoredCount} data stores. Please refresh the page.`);
            setError('');

            // Auto-refresh after 2 seconds
            setTimeout(() => window.location.reload(), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to import backup');
            setSuccess('');
        }
    };

    const handleImportEntity = async () => {
        setError('Individual entity import is not yet implemented. Please use Full Backup import for now.');
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Import Data</h3>

                {/* Import Type Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Import Type</label>
                    <select
                        value={importType}
                        onChange={(e) => setImportType(e.target.value as 'backup' | 'entity')}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="backup">Full System Backup</option>
                        <option value="entity">Individual Entity (Not Implemented)</option>
                    </select>
                </div>

                {/* File Upload */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select File
                        </label>
                        <input
                            type="file"
                            accept=".json,.csv"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700 dark:text-gray-300"
                        />
                    </div>

                    {selectedFile && (
                        <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Selected: <span className="font-medium">{selectedFile.name}</span>
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                                <p className="ml-3 text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                        </div>
                    )}

                    <button
                        onClick={importType === 'backup' ? handleImportBackup : handleImportEntity}
                        disabled={!selectedFile}
                        className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Import {importType === 'backup' ? 'Backup' : 'Entity'}
                    </button>
                </div>
            </div>

            {/* Warning */}
            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Warning</h3>
                        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                            Importing a full backup will overwrite all existing data. Make sure to export your current data first if you want to keep it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
