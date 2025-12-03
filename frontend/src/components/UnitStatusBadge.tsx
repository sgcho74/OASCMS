import { UnitStatus } from '@/store/useUnitStore';

interface Props {
  status: UnitStatus;
}

export default function UnitStatusBadge({ status }: Props) {
  const styles = {
    Available: 'bg-green-100 text-green-800',
    Reserved: 'bg-yellow-100 text-yellow-800',
    Sold: 'bg-gray-100 text-gray-800',
    OnHold: 'bg-orange-100 text-orange-800',
    LotteryLocked: 'bg-purple-100 text-purple-800',
    ContractPending: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}
