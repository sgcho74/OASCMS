import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LeadSource = 'Walk-In' | 'Referral' | 'Online' | 'Advertisement' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    source: LeadSource;
    status: LeadStatus;
    interestedProjects: string[]; // Project IDs
    budget?: number;
    notes?: string;
    createdAt: string;
    lastContactDate?: string;
    convertedToCustomerId?: string; // Link to Reservation/Contract
}

interface LeadState {
    leads: Lead[];
    addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
    updateLead: (id: string, updates: Partial<Lead>) => void;
    deleteLead: (id: string) => void;
    convertLead: (id: string, customerId: string) => void;
}

export const useLeadStore = create<LeadState>()(
    persist(
        (set) => ({
            leads: [],
            addLead: (lead) =>
                set((state) => ({
                    leads: [
                        ...state.leads,
                        {
                            ...lead,
                            id: crypto.randomUUID(),
                            createdAt: new Date().toISOString(),
                        },
                    ],
                })),
            updateLead: (id, updates) =>
                set((state) => ({
                    leads: state.leads.map((l) =>
                        l.id === id ? { ...l, ...updates } : l
                    ),
                })),
            deleteLead: (id) =>
                set((state) => ({
                    leads: state.leads.filter((l) => l.id !== id),
                })),
            convertLead: (id, customerId) =>
                set((state) => ({
                    leads: state.leads.map((l) =>
                        l.id === id
                            ? { ...l, status: 'Converted', convertedToCustomerId: customerId }
                            : l
                    ),
                })),
        }),
        {
            name: 'lead-storage',
        }
    )
);
