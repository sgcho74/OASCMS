import { Reservation } from '@/store/useReservationStore';
import { X, User, Phone, Calendar, FileText, Award, Download } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerDetailsModalProps {
    reservation: Reservation;
    unitDetails: string;
    onClose: () => void;
}

export default function CustomerDetailsModal({ reservation, unitDetails, onClose }: CustomerDetailsModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buyer Details</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                        <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900 dark:text-gray-100">
                            <User className="mr-2 h-5 w-5" />
                            Buyer Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                <p className="text-base font-medium text-gray-900 dark:text-gray-100">{reservation.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="flex items-center text-base font-medium text-gray-900 dark:text-gray-100">
                                    <Phone className="mr-1 h-4 w-4" />
                                    {reservation.customerPhone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                        <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900 dark:text-gray-100">
                            <Calendar className="mr-2 h-5 w-5" />
                            Reservation Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Unit</p>
                                <p className="text-base font-medium text-gray-900 dark:text-gray-100">{unitDetails}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                <p>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${reservation.status === 'Active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        reservation.status === 'Converted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            reservation.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        {reservation.status}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Reservation Date</p>
                                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    {format(new Date(reservation.reservationDate), 'PPP')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    {format(new Date(reservation.expiryDate), 'PPP')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lottery Link */}
                    {reservation.applicantId && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                            <h3 className="mb-2 flex items-center text-lg font-medium text-blue-900 dark:text-blue-100">
                                <Award className="mr-2 h-5 w-5" />
                                Lottery Winner
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                This reservation was created from lottery applicant ID: <span className="font-mono font-semibold">{reservation.applicantId}</span>
                            </p>
                        </div>
                    )}

                    {/* Notes */}
                    {reservation.notes && (
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 flex items-center text-lg font-medium text-gray-900 dark:text-gray-100">
                                <FileText className="mr-2 h-5 w-5" />
                                Notes
                            </h3>
                            <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{reservation.notes}</p>
                        </div>
                    )}

                    {/* Documents */}
                    {reservation.documents && reservation.documents.length > 0 && (
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900 dark:text-gray-100">
                                <FileText className="mr-2 h-5 w-5" />
                                Attached Documents
                            </h3>
                            <div className="space-y-2">
                                {reservation.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                                {doc.type === 'ID Card' && '신분증 사본'}
                                                {doc.type === 'Resident Registration' && '주민등록등본'}
                                                {doc.type === 'Seal Certificate' && '인감증명서'}
                                                {doc.type === 'Bankbook Copy' && '환불계좌 통장사본'}
                                                {doc.type === 'Deposit Receipt' && '입금확인증'}
                                                {!['ID Card', 'Resident Registration', 'Seal Certificate', 'Bankbook Copy', 'Deposit Receipt'].includes(doc.type) && doc.type}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {doc.fileName} • {format(new Date(doc.uploadedAt), 'yyyy-MM-dd HH:mm')}
                                            </p>
                                        </div>
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                                            title="Download / Preview"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!reservation.notes && !reservation.applicantId && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No additional notes or lottery information available.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
