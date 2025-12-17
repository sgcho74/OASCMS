import { useReservationStore } from '@/store/useReservationStore';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ReservationStats() {
    const { reservations } = useReservationStore();

    const active = reservations.filter((r) => r.status === 'Active').length;
    const converted = reservations.filter((r) => r.status === 'Converted').length;
    const cancelled = reservations.filter((r) => r.status === 'Cancelled').length;
    const expired = reservations.filter((r) => r.status === 'Expired').length;

    const stats = [
        { name: 'Active Reservations', value: active, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { name: 'Converted (Sold)', value: converted, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { name: 'Cancelled', value: cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
        { name: 'Expired', value: expired, icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
                <div
                    key={item.name}
                    className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6 dark:bg-gray-800"
                >
                    <dt>
                        <div className={`absolute rounded-md p-3 ${item.bg}`}>
                            <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                        </div>
                        <p className="ms-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                            {item.name}
                        </p>
                    </dt>
                    <dd className="ms-16 flex items-baseline pb-1 sm:pb-7">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                    </dd>
                </div>
            ))}
        </div>
    );
}
