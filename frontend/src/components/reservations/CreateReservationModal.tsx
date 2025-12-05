import { useState, useEffect } from 'react';
import { useReservationStore } from '@/store/useReservationStore';
import { useUnitStore } from '@/store/useUnitStore';
import { useLotteryStore } from '@/store/useLotteryStore';
import { X, Search } from 'lucide-react';
import { addDays, format } from 'date-fns';

interface CreateReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateReservationModal({ isOpen, onClose }: CreateReservationModalProps) {
    const { addReservation } = useReservationStore();
    const { units, setUnitStatus } = useUnitStore();
    const { rounds } = useLotteryStore();

    const [step, setStep] = useState(1);
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [customerType, setCustomerType] = useState<'Lottery' | 'New'>('New');
    const [selectedApplicantId, setSelectedApplicantId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [reservationDate, setReservationDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [expiryDate, setExpiryDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedUnitId('');
            setCustomerType('New');
            setCustomerName('');
            setCustomerPhone('');
            setReservationDate(format(new Date(), 'yyyy-MM-dd'));
            setExpiryDate(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
        }
    }, [isOpen]);

    const availableUnits = units.filter((u) => u.status === 'Available');

    // Flatten all applicants from all rounds for search (simplified)
    const allApplicants = rounds.flatMap((r) => r.applicants);

    const handleUnitSelect = (id: string) => {
        setSelectedUnitId(id);
        setStep(2);
    };

    const handleApplicantSelect = (applicantId: string) => {
        const applicant = allApplicants.find((a) => a.id === applicantId);
        if (applicant) {
            setSelectedApplicantId(applicantId);
            setCustomerName(applicant.name);
            setCustomerPhone(applicant.phone); // Assuming phone exists on applicant, or use ID
            setStep(3);
        }
    };

    const handleNewCustomerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customerName && customerPhone) {
            setStep(3);
        }
    };

    const handleFinalSubmit = () => {
        if (selectedUnitId && customerName) {
            addReservation({
                unitId: selectedUnitId,
                applicantId: customerType === 'Lottery' ? selectedApplicantId : undefined,
                customerName,
                customerPhone,
                reservationDate,
                expiryDate,
                status: 'Active',
            });
            setUnitStatus([selectedUnitId], 'Reserved');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        New Reservation (Step {step}/3)
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Step 1: Select Unit */}
                {step === 1 && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select an available unit to reserve.</p>
                        <div className="max-h-96 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Unit</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Price</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {availableUnits.map((unit) => (
                                        <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{unit.unitNumber}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{unit.typeCode}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">${unit.basePrice.toLocaleString()}</td>
                                            <td className="px-4 py-2 text-right">
                                                <button
                                                    onClick={() => handleUnitSelect(unit.id)}
                                                    className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {availableUnits.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                                                No available units found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Step 2: Customer Info */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                            <button
                                onClick={() => setCustomerType('New')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${customerType === 'New'
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}
                            >
                                New Buyer
                            </button>
                            <button
                                onClick={() => setCustomerType('Lottery')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${customerType === 'Lottery'
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}
                            >
                                Lottery Winner
                            </button>
                        </div>

                        {customerType === 'New' ? (
                            <form onSubmit={handleNewCustomerSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Next
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Select a lottery applicant:</p>
                                <div className="max-h-60 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                                    {allApplicants.map((applicant) => (
                                        <div
                                            key={applicant.id}
                                            onClick={() => handleApplicantSelect(applicant.id)}
                                            className="cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                        >
                                            <div className="font-medium text-gray-900 dark:text-white">{applicant.name}</div>
                                            <div className="text-xs text-gray-500">{applicant.phone}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700/50">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Reservation Summary</h3>
                            <dl className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                <div className="flex justify-between">
                                    <dt>Unit:</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">
                                        {units.find((u) => u.id === selectedUnitId)?.unitNumber}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Buyer:</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">{customerName}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Phone:</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">{customerPhone}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reservation Date</label>
                                <input
                                    type="date"
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                                <input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setStep(2)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Confirm Reservation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
