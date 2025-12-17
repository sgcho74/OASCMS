"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContractStore } from '@/store/useContractStore';
import SignaturePad from '@/components/common/SignaturePad';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function BuyerSignaturePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { contracts, signContractBuyer } = useContractStore();
    const [contract, setContract] = useState(contracts.find(c => c.id === id));
    const [signature, setSignature] = useState<string | null>(null);

    useEffect(() => {
        // Re-fetch in case store updates or hydration issues
        const found = contracts.find(c => c.id === id);
        setContract(found);
    }, [id, contracts]);

    if (!contract) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Contract Not Found</h1>
                    <p className="text-gray-500">The contract you are looking for does not exist or has been removed.</p>
                </div>
            </div>
        );
    }

    if (contract.buyerSignature) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-xl text-center">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Signature Confirmed</h1>
                    <p className="text-gray-600 mb-6">You have successfully signed the contract.</p>
                    <div className="p-4 bg-gray-50 rounded border border-gray-100 text-left text-sm text-gray-500">
                        <p><strong>Ref:</strong> {contract.id}</p>
                        <p><strong>Signed At:</strong> {new Date(contract.buyerSignedAt!).toLocaleString()}</p>
                    </div>
                    {/* Add a button based on routing needs. In generic view maybe just a close. */}
                </div>
            </div>
        );
    }

    const handleSign = () => {
        if (!signature) {
            alert("Please provide your signature before confirming.");
            return;
        }
        if (confirm("Are you sure you want to sign this contract? This action cannot be undone.")) {
            signContractBuyer(contract.id, signature);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="border-b pb-4 mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Real Estate Sales Contract</h1>
                        <p className="text-gray-500 mt-1">Contract No: {contract.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-gray-500">Buyer</span>
                            <span className="block font-medium text-gray-900 text-lg">{contract.customerName}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Property</span>
                            <span className="block font-medium text-gray-900 text-lg">Unit {contract.unitNumber}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Total Amount</span>
                            <span className="block font-medium text-gray-900 text-lg">${contract.totalAmount.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Status</span>
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                {contract.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Terms Scrollable */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Terms & Conditions</h2>
                    <div className="h-64 overflow-y-auto rounded border p-4 bg-gray-50 text-sm leading-relaxed text-gray-600">
                        <p className="font-bold mb-2">Article 1 (Purpose)</p>
                        <p className="mb-4">The purpose of this Contract is to set forth the rights and obligations of the Seller and the Buyer regarding the sale and purchase of the property described above.</p>

                        <p className="font-bold mb-2">Article 2 (Payment Terms)</p>
                        <p className="mb-4">The Buyer agrees to pay the Total Contract Amount in installments as specified in the Payment Schedule below. Failure to pay on time may result in penalties or termination.</p>

                        <p className="font-bold mb-2">Article 3 (Ownership Transfer)</p>
                        <p className="mb-4">Ownership of the property shall be transferred to the Buyer upon full payment of the Total Contract Amount and completion of registration procedures.</p>

                        <p className="font-bold mb-2">Article 4 (Cancellation)</p>
                        <p className="mb-4">Either party may cancel this contract under specific conditions. If the Buyer cancels without cause, the deposit may be forfeited.</p>

                        <div className="my-8 text-center text-gray-400 italic">-- End of Terms --</div>
                    </div>
                </div>

                {/* Payment Schedule Table */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Schedule</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500">Installment</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500">Due Date</th>
                                    <th className="px-4 py-2 text-right font-medium text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {contract.paymentSchedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-4 py-2 text-gray-900">{schedule.name}</td>
                                        <td className="px-4 py-2 text-gray-500">{schedule.dueDate}</td>
                                        <td className="px-4 py-2 text-right font-medium text-gray-900">${schedule.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Signature Area */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Buyer Signature</h2>
                    <p className="text-sm text-gray-500 mb-4">By signing below, you acknowledge that you have read and agreed to the Terms & Conditions and Payment Schedule.</p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sign Here</label>
                        <div className="h-48 w-full border-2 border-dashed border-gray-300 rounded-lg">
                            <SignaturePad onEnd={setSignature} className="h-full w-full" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            onClick={() => router.back()} // Or close window logic
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSign}
                            disabled={!signature}
                            className={`rounded-md px-6 py-3 text-white font-medium shadow-sm transition-colors ${signature
                                    ? 'bg-blue-600 hover:bg-blue-700 align-middle'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Confirm & Sign Contract
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
