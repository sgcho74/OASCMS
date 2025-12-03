import clsx from 'clsx';

export type UnitStatus = 'Available' | 'Reserved' | 'Sold' | 'OnHold' | 'LotteryLocked' | 'ContractPending';

const statusStyles: Record<UnitStatus, string> = {
  Available: 'bg-green-50 text-green-700 ring-green-600/20',
  Reserved: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  Sold: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  OnHold: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  LotteryLocked: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  ContractPending: 'bg-blue-50 text-blue-700 ring-blue-600/20',
};

export default function UnitStatusBadge({ status }: { status: UnitStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        statusStyles[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10'
      )}
    >
      {status}
    </span>
  );
}
