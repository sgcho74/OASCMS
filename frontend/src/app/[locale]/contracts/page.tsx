'use client';

import { useState, useEffect } from 'react';
import { useContractStore, ContractStatus } from '@/store/useContractStore';
import { useProjectStore } from '@/store/useProjectStore';
import PaymentScheduleTable from '@/components/PaymentScheduleTable';
import { Plus, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function ContractsPage() {
  const { contracts, addContract, deleteContract } = useContractStore();
  const { projects } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  // Form State
  const [projectId, setProjectId] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  // Hydration fix
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContract({
      projectId,
      unitNumber,
      customerName,
      totalAmount: Number(totalAmount),
      status: 'draft',
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectId('');
    setUnitNumber('');
    setCustomerName('');
    setTotalAmount('');
  };

  const toggleExpand = (id: string) => {
    setExpandedContractId(expandedContractId === id ? null : id);
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Contract
        </button>
      </div>

      {contracts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
          <FileText className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts</h3>
          <p className="mt-1 text-sm text-gray-500">Create a contract to generate a payment schedule.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => {
            const project = projects.find((p) => p.id === contract.projectId);
            return (
              <div key={contract.id} className="rounded-lg border bg-white shadow-sm">
                <div 
                  className="flex cursor-pointer items-center justify-between p-6 hover:bg-gray-50"
                  onClick={() => toggleExpand(contract.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Unit {contract.unitNumber} - {contract.customerName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {project?.name || 'Unknown Project'} • ${contract.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                      {contract.status.toUpperCase()}
                    </span>
                    {expandedContractId === contract.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedContractId === contract.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="mb-4 text-sm font-medium text-gray-900">Payment Schedule</h4>
                    <PaymentScheduleTable payments={contract.payments} />
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteContract(contract.id);
                        }}
                        className="flex items-center text-sm text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete Contract
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-xl font-bold mb-4">New Contract</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Number</label>
                <input
                  type="text"
                  required
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount ($)</label>
                <input
                  type="number"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
