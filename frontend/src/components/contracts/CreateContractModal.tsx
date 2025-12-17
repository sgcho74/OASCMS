import { useState, useEffect } from 'react';
import { useContractStore } from '@/store/useContractStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useUnitStore } from '@/store/useUnitStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import { X } from 'lucide-react';

interface CreateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        projectId?: string;
        unitNumber?: string;
        customerName?: string;
        totalAmount?: number;
        reservationId?: string;
        applicantId?: string;
        blockId?: string;
        buildingId?: string;
    };
    onSuccess?: () => void;
}

export default function CreateContractModal({ isOpen, onClose, initialData, onSuccess }: CreateContractModalProps) {
    const { addContract, contracts } = useContractStore();
    const { projects } = useProjectStore();
    const { blocks } = useBlockStore();
    const { buildings } = useBuildingStore();
    const { getAvailableUnits, setUnitStatus } = useUnitStore();

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

    useEffect(() => {
        if (isOpen && initialData) {
            setProjectId(initialData.projectId || '');
            setBlockId(initialData.blockId || '');
            setBuildingId(initialData.buildingId || '');
            setUnitNumber(initialData.unitNumber || '');
            setCustomerName(initialData.customerName || '');
            if (initialData.totalAmount) {
                setTotalAmount(initialData.totalAmount.toString());
            }
        } else if (isOpen) {
            // Reset form if no initial data
            // Check if we need to reset here or rely on specific close actions
        }
    }, [isOpen, initialData]);

    const resetForm = () => {
        setProjectId('');
        setBlockId('');
        setBuildingId('');
        setUnitNumber('');
        setCustomerName('');
        setTotalAmount('');
        setStep(1);
        setAgreedToTerms(false);
    };

    // Filtered Options
    const filteredBlocks = blocks.filter(b => b.projectId === projectId);
    const filteredBuildings = buildings.filter(b => b.blockId === blockId);

    // Get available units
    const availableUnits = getAvailableUnits(projectId).filter(u => {
        // If we are passing a specific unit via initialData, we should allow it regardless of status checks if needed,
        // but typically the unit should be in a state that allows contracting (Available or Reserved).
        // Since getAvailableUnits defaults to 'Available', we might need to fetch ALL units and filter manually
        // if the unit is currently 'Reserved'. 
        // For simplicity now, let's assume we can fetch it if we bypass status check or if we check explicitly.

        // Actually, getAvailableUnits filters by 'Available'.
        // If coming from Reservation, the unit is 'Reserved'.
        // We need a way to select the specific unit even if it's Reserved.

        if (initialData?.unitNumber && u.unitNumber === initialData.unitNumber) {
            return true;
        }

        if (u.status !== 'Available') return false;

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

    // We need to fetch the specific unit if it's not in "Available" list (e.g. Reserved)
    // The useUnitStore might need a direct "getUnit" or we rely on 'units' array.
    const { units } = useUnitStore();
    const selectableUnits = units.filter(u => {
        // Logic: 
        // 1. Must match project/block/building filters.
        // 2. Status must be Available OR (Reserved AND matches initialData.unitNumber)

        if (projectId && u.projectId !== projectId) return false;
        if (blockId && u.blockId !== blockId) return false;
        if (buildingId && u.buildingId !== buildingId) return false;

        if (initialData?.unitNumber && u.unitNumber === initialData.unitNumber) return true;

        const isContracted = contracts.some(c =>
            c.projectId === projectId &&
            c.unitNumber === u.unitNumber &&
            c.status !== 'terminated'
        );
        if (isContracted) return false;

        return u.status === 'Available';
    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addContract({
            projectId,
            unitNumber,
            customerName,
            totalAmount: Number(totalAmount),
            status: 'draft',
            reservationId: initialData?.reservationId,
            applicantId: initialData?.applicantId
        });

        // Update unit status to ContractPending (or Sold)
        // Find unit ID
        const selectedUnit = units.find(u => u.unitNumber === unitNumber && u.projectId === projectId);
        if (selectedUnit) {
            setUnitStatus([selectedUnit.id], 'ContractPending');
        }

        if (onSuccess) onSuccess();
        onClose();
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">New Contract</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 2: {step === 1 ? 'Contract Details' : 'Terms & Conditions'}</p>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
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
                                        disabled={!!initialData?.projectId}
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                                    <select
                                        value={unitNumber}
                                        onChange={(e) => setUnitNumber(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                        required
                                        disabled={!buildingId || !!initialData?.unitNumber}
                                    >
                                        <option value="">Select Unit</option>
                                        {selectableUnits.map((u) => (
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
                                    readOnly={!!initialData?.customerName}
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
                                <p>The purpose of this Contract is to set forth the rights and obligations of the Seller...</p>

                                <p className="font-bold">Article 2 (Payment Terms)</p>
                                <p>1. The Buyer shall pay the Total Contract Amount...</p>

                                {/* ... (Truncated standard terms for brevity, but can include all if needed) ... */}
                                <p className="font-bold">Terms Accepted</p>
                                <p>By proceeding, you agree to all terms and conditions.</p>
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
                                    onClose();
                                    resetForm();
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
    );
}
