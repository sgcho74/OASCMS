import { useContractStore } from '@/store/useContractStore';
import { useUnitStore } from '@/store/useUnitStore';
import { useReservationStore } from '@/store/useReservationStore';
import { usePaymentStore } from '@/store/usePaymentStore';
import { DollarSign, ShoppingCart, Clock, AlertCircle } from 'lucide-react';

export default function DashboardStats() {
    const { contracts } = useContractStore();
    const { units } = useUnitStore();
    const { reservations } = useReservationStore();
    const { payments } = usePaymentStore();

    // Calculate Total Revenue (Sum of all contract values)
    const totalRevenue = contracts.reduce((sum, c) => sum + c.totalAmount, 0);

    // Calculate Unit Sales %
    const totalUnits = units.length;
    const soldUnits = units.filter((u) => u.status === 'Sold').length;
    const salesPercentage = totalUnits > 0 ? Math.round((soldUnits / totalUnits) * 100) : 0;

    // Active Reservations
    const activeReservations = reservations.filter((r) => r.status === 'Active').length;

    // Pending Payments (Overdue)
    // This is a simplified calculation. In a real app, we'd check payment schedules.
    // For now, let's just count payments with status 'Pending' if we had that, 
    // or just use a placeholder logic based on contracts.
    // Let's use "Total Contracts" as a proxy for activity if we don't have granular pending payment logic easily accessible without heavy computation.
    // Actually, let's use the number of contracts as "Active Deals".
    const activeDeals = contracts.length;

    const stats = [
        {
            name: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/30'
        },
        {
            name: 'Sales Progress',
            value: `${salesPercentage}% (${soldUnits}/${totalUnits})`,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            name: 'Active Reservations',
            value: activeReservations,
            icon: Clock,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            name: 'Active Contracts',
            value: activeDeals,
            icon: AlertCircle,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        },
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
                        <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                            {item.name}
                        </p>
                    </dt>
                    <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                    </dd>
                </div>
            ))}
        </div>
    );
}
