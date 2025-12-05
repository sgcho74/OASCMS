import { useState, useRef } from 'react';
import { parseUnitCsv, CsvImportResult } from '@/utils/csvParser';
import { useUnitStore } from '@/store/useUnitStore';
import { Upload, X, AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface CsvUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CsvUploadModal({ isOpen, onClose }: CsvUploadModalProps) {
    const { bulkAddUnits } = useUnitStore();
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<CsvImportResult | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const parseResult = await parseUnitCsv(selectedFile);
            setResult(parseResult);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            const parseResult = await parseUnitCsv(selectedFile);
            setResult(parseResult);
        }
    };

    const handleImport = () => {
        if (result && result.success) {
            bulkAddUnits(result.data);
            onClose();
            setFile(null);
            setResult(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Import Units via CSV</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {!file ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors
              ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Drag and drop your CSV file here, or click to select
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                            Required columns: ProjectId, BlockId, BuildingId, UnitNumber, Floor, TypeCode, BasePrice, Status
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv"
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <FileText className="h-8 w-8 text-indigo-500" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setResult(null); }}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>

                        {result && (
                            <div className={`rounded-lg p-4 ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                <div className="flex items-start">
                                    {result.success ? (
                                        <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                                    )}
                                    <div className="ml-3">
                                        <h3 className={`text-sm font-medium ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                            {result.success ? 'Validation Successful' : 'Validation Failed'}
                                        </h3>
                                        <div className={`mt-2 text-sm ${result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                            {result.success ? (
                                                <p>Ready to import {result.data.length} units.</p>
                                            ) : (
                                                <ul className="list-disc space-y-1 pl-5">
                                                    {result.errors.slice(0, 5).map((err, i) => (
                                                        <li key={i}>{err}</li>
                                                    ))}
                                                    {result.errors.length > 5 && <li>...and {result.errors.length - 5} more errors</li>}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!result?.success}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Import {result?.data.length} Units
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
