import { useState, useEffect } from 'react';
import { Lead, useLeadStore, LeadStatus } from '@/store/useLeadStore';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface LeadDetailModalProps {
    isOpen: boolean;
    leadId: string | null;
    onClose: () => void;
}

export default function LeadDetailModal({ isOpen, leadId, onClose }: LeadDetailModalProps) {
    const { leads, updateLead } = useLeadStore();
    const [lead, setLead] = useState<Lead | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (leadId) {
            const foundLead = leads.find((l) => l.id === leadId);
            setLead(foundLead || null);
        }
    }, [leadId, leads]);

    if (!isOpen || !lead) return null;

    const handleStatusChange = (newStatus: LeadStatus) => {
        updateLead(lead.id, {
            status: newStatus,
            lastContactDate: new Date().toISOString()
        });
    };

    const handleMarkLost = () => {
        if (confirm('Mark this lead as lost?')) {
            handleStatusChange('Lost');
        }
    };

    const handleUpdateNotes = (notes: string) => {
        updateLead(lead.id, { notes });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
                <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lead Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.phone}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Source</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.source}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Budget</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {lead.budget ? `$${lead.budget.toLocaleString()}` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {format(new Date(lead.createdAt), 'yyyy-MM-dd')}
                                </p>
                            </div>
                        </div>

                        {/* Status Management */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                            <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                                disabled={lead.status === 'Converted'}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                            <textarea
                                value={lead.notes || ''}
                                onChange={(e) => handleUpdateNotes(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Add notes about this lead..."
                            />
                        </div>

                        {/* Conversion Info */}
                        {lead.status === 'Converted' && lead.convertedToCustomerId && (
                            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                                <div className="flex">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <div className="ml-3">
                                        <p className="text-sm text-green-800 dark:text-green-200">
                                            This lead has been converted to a customer (ID: {lead.convertedToCustomerId})
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                            {lead.status !== 'Converted' && lead.status !== 'Lost' && (
                                <button
                                    onClick={handleMarkLost}
                                    className="flex items-center rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Mark as Lost
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
