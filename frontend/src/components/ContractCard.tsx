import { useState, useRef } from 'react';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useContractStore, Contract } from '@/store/useContractStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useUnitStore } from '@/store/useUnitStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import PaymentScheduleTable from '@/components/PaymentScheduleTable';
import PermissionGate from '@/components/auth/PermissionGate';
import { Trash2, FileText, ChevronDown, ChevronUp, Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print'; // We don't have this lib, so we'll use standard window.print with CSS

interface ContractCardProps {
  contract: Contract;
  expandedContractId: string | null;
  toggleExpand: (id: string) => void;
}

export default function ContractCard({ contract, expandedContractId, toggleExpand }: ContractCardProps) {
  const { projects } = useProjectStore();
  const { units } = useUnitStore();
  const { blocks } = useBlockStore();
  const { buildings } = useBuildingStore();
  const { deleteContract } = useContractStore();
  const { getPaymentsByContract } = usePaymentStore();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);

  const project = projects.find((p) => p.id === contract.projectId);
  const unit = units.find(u => u.unitNumber === contract.unitNumber && u.projectId === contract.projectId);
  const block = blocks.find(b => b.id === unit?.blockId);
  const building = buildings.find(b => b.id === unit?.buildingId);

  // Calculate total paid from actual payments
  const payments = getPaymentsByContract(contract.id);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = Math.max(0, contract.totalAmount - totalPaid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50">
        <div
          className="flex cursor-pointer items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          onClick={() => toggleExpand(contract.id)}
        >
          {/* Left: Contract Info */}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2 text-indigo-600 dark:text-indigo-300">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Unit {contract.unitNumber} - {contract.customerName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {project?.name || 'Unknown Project'}
              </p>
            </div>
          </div>

          {/* Center: Financial Summary */}
          <div className="flex items-center gap-6">
            <div className="text-left">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ${contract.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paid</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ${totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Outstanding</p>
              <p className={`text-lg font-bold ${outstanding > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                ${outstanding.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right: Status and Expand Icon */}
          <div className="flex items-center space-x-4">
            <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200">
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
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6">
            {/* Contract Details Section */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contract Information</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPrintModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Printer className="w-4 h-4" />
                  Print Contract
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Buyer</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{contract.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Project</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{project?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Location</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {block?.blockName} / {building?.buildingNo} / {contract.unitNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Contract Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(contract.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Terms Section */}
            <div className="mb-8">
              <button
                onClick={() => setIsTermsExpanded(!isTermsExpanded)}
                className="flex w-full items-center justify-between rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100">Terms & Conditions</span>
                {isTermsExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {isTermsExpanded && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-64 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="font-bold">Article 1 (Purpose)</p>
                <p>
                  The purpose of this Contract is to set forth the rights and obligations of the Seller (hereinafter referred to as "Company") and the Buyer (hereinafter referred to as "Buyer") in connection with the sale and purchase of the real estate property described herein.
                </p>
                
                <p className="font-bold">Article 2 (Payment Terms)</p>
                <p>
                  1. The Buyer shall pay the Total Contract Amount in accordance with the Payment Schedule attached hereto.<br/>
                  2. Payments shall be made in the currency specified (USD/KRW/IQD) to the bank account designated by the Company.<br/>
                  3. Failure to make payments by the due date may result in late fees or termination of this Contract as per Article 5.
                </p>

                <p className="font-bold">Article 3 (Transfer of Ownership)</p>
                <p>
                  Ownership of the property shall be transferred to the Buyer upon full payment of the Total Contract Amount and completion of all necessary registration procedures. The Company shall provide all necessary documents for the transfer of ownership.
                </p>

                <p className="font-bold">Article 4 (Property Condition)</p>
                <p>
                  The Buyer acknowledges that they have inspected the property (or the model house/plans for under-construction properties) and agrees to purchase it in its current condition. Any defects discovered after the transfer of ownership shall be handled in accordance with the relevant laws and the Company's warranty policy.
                </p>

                <p className="font-bold">Article 5 (Termination)</p>
                <p>
                  1. The Company may terminate this Contract if the Buyer fails to make any payment for more than 30 days after the due date.<br/>
                  2. The Buyer may terminate this Contract by forfeiting the Down Payment (Deposit) if the termination occurs before the first Progress Payment.<br/>
                  3. Upon termination, any amount paid by the Buyer, less the forfeited Down Payment and any other applicable penalties, shall be refunded without interest.
                </p>

                <p className="font-bold">Article 6 (Force Majeure)</p>
                <p>
                  Neither party shall be liable for any delay or failure to perform their obligations under this Contract due to causes beyond their reasonable control, including but not limited to acts of God, war, strikes, or government regulations.
                </p>

                <p className="font-bold">Article 7 (Dispute Resolution)</p>
                <p>
                  Any disputes arising out of or in connection with this Contract shall be amicably settled through negotiation. If no settlement is reached, the dispute shall be submitted to the competent court having jurisdiction over the location of the property.
                </p>
              </div>
              )}
            </div>

            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Payment Schedule</h4>
            <PaymentScheduleTable
              contractId={contract.id}
              schedules={contract.paymentSchedules || contract.payments?.map((p, idx) => ({
                id: p.id,
                stageType: 'Progress' as const,
                installmentNo: idx + 1,
                name: p.description,
                dueDate: p.dueDate,
                amount: p.amount,
                status: p.status,
              })) || []}
            />
            <PermissionGate permission="contracts:delete">
              <div className="mt-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (unit) {
                      useUnitStore.getState().setUnitStatus([unit.id], 'Available');
                    }
                    deleteContract(contract.id);
                  }}
                  className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete Contract
                </button>
              </div>
            </PermissionGate>
          </div>
        )}
      </div>

      {/* Print Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 print:bg-white print:static print:h-auto print:w-auto print:block p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:dark:bg-white print:w-full print:max-w-none print:max-h-none print:overflow-visible">
            {/* Modal Header (Hidden in Print) */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 print:hidden flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Print Contract</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="p-8 print:p-0 printable-content bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-y-auto">
              {/* Print Header */}
              <div className="mb-8 text-center border-b-2 border-gray-800 dark:border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">OFFICIAL CONTRACT</h1>
                <p className="text-gray-600 dark:text-gray-400">Contract ID: {contract.id.slice(0, 8).toUpperCase()}</p>
              </div>

              {/* Contract Info Grid */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Buyer Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{contract.customerName}</p>
                    <p className="text-gray-600 dark:text-gray-300">Status: {contract.status.toUpperCase()}</p>
                    <p className="text-gray-600 dark:text-gray-300">Date: {new Date(contract.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Property Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{project?.name}</p>
                    <p className="text-gray-600 dark:text-gray-300">Block: {block?.blockName}</p>
                    <p className="text-gray-600 dark:text-gray-300">Building: {building?.buildingNo}</p>
                    <p className="text-gray-600 dark:text-gray-300">Unit: {contract.unitNumber}</p>
                  </div>
                </div>
              </div>

              {/* Legal Terms for Print */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Terms & Conditions</h3>
                <div className="text-sm text-gray-800 dark:text-gray-200 space-y-4 border-t border-b border-gray-200 dark:border-gray-700 py-4">
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
              </div>

              {/* Financial Summary */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Financial Summary</h3>
                <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">${contract.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">${totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding</p>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">${outstanding.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Payment Schedule</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Installment</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Due Date</th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                        <th className="px-4 py-2 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {contract.paymentSchedules.map((s) => (
                        <tr key={s.id}>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{s.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{s.dueDate}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">${s.amount.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              s.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                              s.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {s.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Generated by OASCMS on {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Print Styles */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-content, .printable-content * {
                visibility: visible;
              }
              .printable-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
                color: black !important;
              }
              .printable-content h1, 
              .printable-content h2, 
              .printable-content h3, 
              .printable-content p, 
              .printable-content td, 
              .printable-content th {
                color: black !important;
              }
              .printable-content .bg-gray-50,
              .printable-content .dark\\:bg-gray-700\\/50,
              .printable-content .dark\\:bg-gray-800 {
                background-color: #f9fafb !important; /* light gray for print */
              }
              .printable-content .border-gray-800,
              .printable-content .dark\\:border-gray-200 {
                border-color: black !important;
              }
              /* Hide scrollbars and other UI elements */
              ::-webkit-scrollbar {
                display: none;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
