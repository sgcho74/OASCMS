import { useState } from 'react';
import { Reservation, useReservationStore } from '@/store/useReservationStore';
import { useUnitStore } from '@/store/useUnitStore';
import { format } from 'date-fns';
import { Check, X, Eye } from 'lucide-react';
import CustomerDetailsModal from './CustomerDetailsModal';
import CreateContractModal from '@/components/contracts/CreateContractModal';

interface ReservationListProps {
    reservations: Reservation[];
}

export default function ReservationList({ reservations }: ReservationListProps) {
    const { units, setUnitStatus } = useUnitStore();
    const { cancelReservation, convertReservation } = useReservationStore();
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

    // Contract Conversion
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [contractInitialData, setContractInitialData] = useState<any>(null);

    const getUnitDetails = (unitId: string) => {
        const unit = units.find((u) => u.id === unitId);
        return unit ? `${unit.unitNumber} (${unit.typeCode})` : 'Unknown Unit';
    };

    const handleCancel = (id: string, unitId: string) => {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            cancelReservation(id);
            setUnitStatus([unitId], 'Available');
        }
    };

    const handleConvert = (reservation: Reservation) => {
        if (confirm('Proceed to create a contract for this reservation?')) {
            const unit = units.find(u => u.id === reservation.unitId);
            setContractInitialData({
                projectId: unit?.projectId,
                blockId: unit?.blockId,
                buildingId: unit?.buildingId,
                unitNumber: unit?.unitNumber,
                customerName: reservation.customerName,
                reservationId: reservation.id,
                applicantId: reservation.applicantId,
                totalAmount: unit?.basePrice // Pre-fill price
            });
            setIsContractModalOpen(true);
        }
    };

    const handleContractCreated = () => {
        if (contractInitialData?.reservationId) {
            convertReservation(contractInitialData.reservationId);
            // Unit status update to Sold/ContractPending is handled inside CreateContractModal or via side-effect.
            // But we can double ensure here if needed, or rely on the store update in modal.
            // The modal updates 'ContractPending'.
            // convertReservation updates status to 'Converted'.
        }
        setIsContractModalOpen(false);
        setContractInitialData(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Converted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Buyer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Unit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Expiry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                        {reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{res.customerName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{res.customerPhone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {getUnitDetails(res.unitId)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(res.reservationDate), 'yyyy-MM-dd')}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(res.expiryDate), 'yyyy-MM-dd')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(res.status)}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => setSelectedReservation(res)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {res.status === 'Active' && (
                                            <>
                                                <button
                                                    onClick={() => handleConvert(res)}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                    title="Convert to Sale"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(res.id, res.unitId)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    title="Cancel Reservation"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {reservations.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No reservations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Customer Details Modal */}
            {selectedReservation && (
                <CustomerDetailsModal
                    reservation={selectedReservation}
                    unitDetails={getUnitDetails(selectedReservation.unitId)}
                    onClose={() => setSelectedReservation(null)}
                />
            )}
        </div>
    );
}
