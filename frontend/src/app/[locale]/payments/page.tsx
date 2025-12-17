'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePaymentStore, PaymentMethod } from '@/store/usePaymentStore';
import { useContractStore } from '@/store/useContractStore';
import { useAuthStore } from '@/store/useAuthStore';
import { DollarSign, Plus } from 'lucide-react';
import PermissionGate from '@/components/auth/PermissionGate';

export default function PaymentsPage() {
    const { payments, addPayment } = usePaymentStore();
    const { contracts, updatePaymentStatus } = useContractStore();
    const { currentUser } = useAuthStore();
    const t = useTranslations('Payments');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterMethod, setFilterMethod] = useState<PaymentMethod | 'all'>('all');

    const [formData, setFormData] = useState({
        contractId: '',
        scheduleId: '',
        amount: '',
        currency: 'USD',
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'bank_transfer' as PaymentMethod,
        payerName: '',
        reference: '',
        notes: '',
    });

    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Filtered Payments
    const filteredPayments = payments.filter(payment => {
        const contract = contracts.find(c => c.id === payment.contractId);

        // RBAC Filter: Customers can only see their own payments
        if (currentUser?.role === 'customer') {
            if (contract?.customerName !== currentUser.fullName) {
                return false;
            }
        }

        // Text Search (Payer, Buyer, Unit)
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            payment.payerName.toLowerCase().includes(searchLower) ||
            contract?.customerName.toLowerCase().includes(searchLower) ||
            contract?.unitNumber.toLowerCase().includes(searchLower) ||
            false;

        // Date Range
        const matchesStartDate = startDate ? payment.paymentDate >= startDate : true;
        const matchesEndDate = endDate ? payment.paymentDate <= endDate : true;

        // Method
        const matchesMethod = filterMethod === 'all' ? true : payment.method === filterMethod;

        return matchesSearch && matchesStartDate && matchesEndDate && matchesMethod;
    }).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()); // Sort by date desc

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addPayment({
            contractId: formData.contractId,
            scheduleId: formData.scheduleId || undefined,
            amount: Number(formData.amount),
            currency: formData.currency,
            paymentDate: formData.paymentDate,
            method: formData.method,
            payerName: formData.payerName,
            reference: formData.reference || undefined,
            notes: formData.notes || undefined,
        });

        // If a schedule was selected, mark it as paid
        if (formData.contractId && formData.scheduleId) {
            updatePaymentStatus(formData.contractId, formData.scheduleId, 'paid');
        }

        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            contractId: '',
            scheduleId: '',
            amount: '',
            currency: 'USD',
            paymentDate: new Date().toISOString().split('T')[0],
            method: 'bank_transfer',
            payerName: '',
            reference: '',
            notes: '',
        });
    };

    const selectedContract = contracts.find((c) => c.id === formData.contractId);

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
                <PermissionGate permission="payments:write">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Record Payment
                    </button>
                </PermissionGate>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Payer, Buyer, Unit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Method</label>
                    <select
                        value={filterMethod}
                        onChange={(e) => setFilterMethod(e.target.value as PaymentMethod | 'all')}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    >
                        <option value="all">All Methods</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="card">Card</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                    </select>
                </div>
            </div>

            {/* Payments List */}
            {filteredPayments.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <DollarSign className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No payments found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search filters.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Contract
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Schedule
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Payer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Reference
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {filteredPayments.map((payment) => {
                                const contract = contracts.find((c) => c.id === payment.contractId);
                                // Map legacy payments (no scheduleId) to "선수금 1차"
                                const scheduleName = payment.scheduleId
                                    ? contract?.paymentSchedules?.find(s => s.id === payment.scheduleId)?.name || 'Unknown Schedule'
                                    : '선수금 1차';

                                return (
                                    <tr key={payment.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {payment.paymentDate}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {contract?.customerName || 'Unknown'} - Unit {contract?.unitNumber}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {scheduleName}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {payment.payerName}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {payment.currency} ${payment.amount.toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {payment.method.replace('_', ' ').toUpperCase()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {payment.reference || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Record Payment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6 max-h-[90vh] overflow-y-auto dark:bg-gray-800">
                        <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Record Payment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contract</label>
                                <select
                                    required
                                    value={formData.contractId}
                                    onChange={(e) => {
                                        const newContractId = e.target.value;
                                        const contract = contracts.find(c => c.id === newContractId);
                                        setFormData({
                                            ...formData,
                                            contractId: newContractId,
                                            scheduleId: '',
                                            payerName: contract ? contract.customerName : formData.payerName
                                        });
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select Contract</option>
                                    {contracts.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.customerName} - Unit {c.unitNumber} (${c.totalAmount.toLocaleString()})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedContract && selectedContract.paymentSchedules && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Schedule (Optional)
                                    </label>
                                    <select
                                        value={formData.scheduleId}
                                        onChange={(e) => {
                                            const scheduleId = e.target.value;
                                            const schedule = selectedContract.paymentSchedules?.find(s => s.id === scheduleId);

                                            // Calculate outstanding for auto-fill
                                            let outstandingAmount = 0;
                                            if (schedule) {
                                                const contractPayments = payments.filter(p => p.contractId === selectedContract.id);
                                                const paidForSchedule = contractPayments
                                                    .filter(p => {
                                                        if (p.scheduleId) return p.scheduleId === schedule.id;
                                                        return schedule.stageType === 'Deposit' && schedule.installmentNo === 1;
                                                    })
                                                    .reduce((sum, p) => sum + p.amount, 0);
                                                outstandingAmount = Math.max(0, schedule.amount - paidForSchedule);
                                            }

                                            setFormData({
                                                ...formData,
                                                scheduleId,
                                                amount: schedule ? String(outstandingAmount) : formData.amount,
                                                paymentDate: schedule ? schedule.dueDate : formData.paymentDate,
                                                notes: schedule ? `Payment for ${schedule.name}` : formData.notes
                                            });
                                        }}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">General Payment</option>
                                        {selectedContract.paymentSchedules.map((s) => {
                                            // Calculate outstanding amount
                                            const contractPayments = payments.filter(p => p.contractId === selectedContract.id);
                                            const paidForSchedule = contractPayments
                                                .filter(p => {
                                                    if (p.scheduleId) return p.scheduleId === s.id;
                                                    return s.stageType === 'Deposit' && s.installmentNo === 1;
                                                })
                                                .reduce((sum, p) => sum + p.amount, 0);

                                            const outstanding = Math.max(0, s.amount - paidForSchedule);
                                            const isFullyPaid = outstanding === 0;

                                            return (
                                                <option key={s.id} value={s.id} disabled={isFullyPaid}>
                                                    {s.name} - Outstanding: ${outstanding.toLocaleString()} {isFullyPaid ? '(Paid)' : `(Due: ${s.dueDate})`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="KRW">KRW</option>
                                        <option value="IQD">IQD</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.paymentDate}
                                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
                                    <select
                                        value={formData.method}
                                        onChange={(e) =>
                                            setFormData({ ...formData, method: e.target.value as PaymentMethod })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="card">Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="check">Check</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payer Name</label>
                                <input
                                    type="text"
                                    required
                                    list="payer-names"
                                    value={formData.payerName}
                                    onChange={(e) => setFormData({ ...formData, payerName: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                <datalist id="payer-names">
                                    {Array.from(new Set(contracts.map(c => c.customerName))).map(name => (
                                        <option key={name} value={name} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reference (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    placeholder="Receipt no., bank ref, etc."
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
