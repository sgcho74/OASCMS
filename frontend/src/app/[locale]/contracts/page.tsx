'use client';

import { useState, useEffect } from 'react';
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

export default function ContractsPage() {
  const { contracts, addContract, deleteContract } = useContractStore();
  const { projects } = useProjectStore();
  const { blocks } = useBlockStore();
  const { buildings } = useBuildingStore();
  const { getAvailableUnits } = useUnitStore();
  const { setUnitStatus } = useUnitStore();
  const { currentUser } = useAuthStore(); // Get current user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  // Wizard State
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form State
  const [projectId, setProjectId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  // Hydration fix
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filtered Options
  const filteredBlocks = blocks.filter(b => b.projectId === projectId);
  const filteredBuildings = buildings.filter(b => b.blockId === blockId);

  // Get available units for selected project/block/building
  const availableUnits = getAvailableUnits(projectId).filter(u => {
    if (u.status !== 'Available') return false; // Double check status
    
    // Check if unit is already contracted (excluding terminated contracts)
    const isContracted = contracts.some(c => 
      c.projectId === projectId && 
      c.unitNumber === u.unitNumber && 
      c.status !== 'terminated'
    );
    if (isContracted) return false;

    if (blockId && u.blockId !== blockId) return false;
    if (buildingId && u.buildingId !== buildingId) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContract({
      projectId,
      unitNumber,
      customerName,
      totalAmount: Number(totalAmount),
      status: 'draft',
    });
    
    // Update unit status to ContractPending
    const selectedUnit = availableUnits.find(u => u.unitNumber === unitNumber);
    if (selectedUnit) {
      setUnitStatus([selectedUnit.id], 'ContractPending');
    }

    setIsModalOpen(false);
    resetForm();
    setStep(1);
    setAgreedToTerms(false);
  };


  const resetForm = () => {
    setProjectId('');
    setBlockId('');
    setBuildingId('');
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contracts</h1>
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">New Contract</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 2: {step === 1 ? 'Contract Details' : 'Terms & Conditions'}</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setStep(1);
                  setAgreedToTerms(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                      <select
                        value={projectId}
                        onChange={(e) => {
                          setProjectId(e.target.value);
                          setBlockId('');
                          setBuildingId('');
                          setUnitNumber('');
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Block</label>
                      <select
                        value={blockId}
                        onChange={(e) => {
                          setBlockId(e.target.value);
                          setBuildingId('');
                          setUnitNumber('');
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        disabled={!projectId}
                      >
                        <option value="">Select Block</option>
                        {filteredBlocks.map((b) => (
                          <option key={b.id} value={b.id}>{b.blockName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Building</label>
                      <select
                        value={buildingId}
                        onChange={(e) => {
                          setBuildingId(e.target.value);
                          setUnitNumber('');
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        disabled={!blockId}
                      >
                        <option value="">Select Building</option>
                        {filteredBuildings.map((b) => (
                          <option key={b.id} value={b.id}>{b.buildingNo}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Available Unit</label>
                      <select
                        value={unitNumber}
                        onChange={(e) => setUnitNumber(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        required
                        disabled={!buildingId}
                      >
                        <option value="">Select Unit</option>
                        {availableUnits.map((u) => (
                          <option key={u.id} value={u.unitNumber}>
                            {u.unitNumber} ({u.typeCode || u.type}) - ${u.basePrice.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buyer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-7 pr-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 h-64 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 space-y-4">
                    <p className="font-bold">Article 1 (Purpose)</p>
                    <p>The purpose of this Contract is to set forth the rights and obligations of the Seller (hereinafter referred to as "Company") and the Buyer (hereinafter referred to as "Buyer") in connection with the sale and purchase of the real estate property described herein.</p>
                    
                    <p className="font-bold">Article 2 (Payment Terms)</p>
                    <p>1. The Buyer shall pay the Total Contract Amount in accordance with the Payment Schedule attached hereto.<br/>2. Payments shall be made in the currency specified to the bank account designated by the Company.<br/>3. Failure to make payments by the due date may result in late fees or termination of this Contract.</p>

                    <p className="font-bold">Article 3 (Transfer of Ownership)</p>
                    <p>Ownership of the property shall be transferred to the Buyer upon full payment of the Total Contract Amount and completion of all necessary registration procedures.</p>

                    <p className="font-bold">Article 4 (Property Condition)</p>
                    <p>The Buyer acknowledges that they have inspected the property and agrees to purchase it in its current condition.</p>

                    <p className="font-bold">Article 5 (Termination)</p>
                    <p>The Company may terminate this Contract if the Buyer fails to make any payment for more than 30 days after the due date.</p>
                    
                    <p className="font-bold">Article 6 (Dispute Resolution)</p>
                    <p>Any disputes arising out of or in connection with this Contract shall be amicably settled through negotiation.</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="agree-terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                      I have read and agree to the Terms & Conditions
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1) {
                      setIsModalOpen(false);
                    } else {
                      setStep(1);
                    }
                  }}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (projectId && unitNumber && customerName && totalAmount) {
                        setStep(2);
                      } else {
                        alert('Please fill in all required fields');
                      }
                    }}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Next: Terms & Conditions
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!agreedToTerms}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Contract
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
