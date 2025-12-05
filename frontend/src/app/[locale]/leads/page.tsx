'use client';

import { useState, useEffect } from 'react';
import { useLeadStore, LeadStatus } from '@/store/useLeadStore';
import LeadStats from '@/components/leads/LeadStats';
import LeadList from '@/components/leads/LeadList';
import CreateLeadModal from '@/components/leads/CreateLeadModal';
import LeadDetailModal from '@/components/leads/LeadDetailModal';
import PermissionGate from '@/components/auth/PermissionGate';
import { Plus } from 'lucide-react';

export default function LeadsPage() {
    const { leads } = useLeadStore();
    const [isHydrated, setIsHydrated] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    const filteredLeads = statusFilter === 'All'
        ? leads
        : leads.filter((l) => l.status === statusFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CRM & Leads</h1>
                <PermissionGate permission="leads:write">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Lead
                    </button>
                </PermissionGate>
            </div>

            <LeadStats />

            {/* Filters */}
            <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                </select>
            </div>

            <LeadList leads={filteredLeads} onViewDetails={setSelectedLeadId} />

            <CreateLeadModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <LeadDetailModal
                isOpen={selectedLeadId !== null}
                leadId={selectedLeadId}
                onClose={() => setSelectedLeadId(null)}
            />
        </div>
    );
}
