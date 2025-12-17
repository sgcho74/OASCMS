'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useContractStore } from '@/store/useContractStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useUnitStore } from '@/store/useUnitStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import { useAuthStore } from '@/store/useAuthStore'; // Add import
import PaymentScheduleTable from '@/components/PaymentScheduleTable';
import ContractCard from '@/components/ContractCard';
import PermissionGate from '@/components/auth/PermissionGate';
import { Plus, FileText, X } from 'lucide-react';


import CreateContractModal from '@/components/contracts/CreateContractModal';

export default function ContractsPage() {
  const { contracts, deleteContract } = useContractStore(); // Remove addContract as it's handled in modal
  const { currentUser } = useAuthStore();
  const t = useTranslations('Contracts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  // Hydration fix
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedContractId(expandedContractId === id ? null : id);
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </div>
        <PermissionGate permission="contracts:write">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </button>
        </PermissionGate>
      </div>

      {contracts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <FileText className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No contracts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a contract to generate a payment schedule.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts
            .filter(contract => {
              if (currentUser?.role === 'customer') {
                return contract.customerName === currentUser.fullName;
              }
              return true;
            })
            .map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                expandedContractId={expandedContractId}
                toggleExpand={toggleExpand}
              />
            ))}
        </div>
      )}

      {/* Create Contract Modal */}
      <CreateContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
