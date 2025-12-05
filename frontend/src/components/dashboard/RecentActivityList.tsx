import { useReservationStore } from '@/store/useReservationStore';
import { useContractStore } from '@/store/useContractStore';
import { format } from 'date-fns';
import { Clock, FileText } from 'lucide-react';

export default function RecentActivityList() {
    const { reservations } = useReservationStore();
    const { contracts } = useContractStore();

    // Combine and sort activities
    const activities = [
        ...reservations.map((r) => ({
            id: r.id,
            type: 'Reservation',
            description: `New reservation for Unit (ID: ${r.unitId}) by ${r.customerName}`,
            date: new Date(r.reservationDate),
            icon: Clock,
            color: 'bg-blue-500',
        })),
        ...contracts.map((c) => ({
            id: c.id,
            type: 'Contract',
            description: `Contract signed for Unit ${c.unitNumber} - $${c.totalAmount.toLocaleString()}`,
            date: new Date(c.createdAt),
            icon: FileText,
            color: 'bg-green-500',
        })),
    ]
        .filter((activity) => !isNaN(activity.date.getTime())) // Filter out invalid dates
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

    return (
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-gray-700">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {activities.map((activity) => (
                    <li key={activity.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${activity.color}`}>
                                    <activity.icon className="h-5 w-5 text-white" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.description}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(activity.date, 'MMM d, yyyy')}
                                </p>
                            </div>
                            <div>
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {activity.type}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
                {activities.length === 0 && (
                    <li className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        No recent activity found.
                    </li>
                )}
            </ul>
        </div>
    );
}
