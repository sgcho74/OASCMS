import { Unit } from '@/store/useUnitStore';
import { Building, CheckCircle, Lock, DollarSign } from 'lucide-react';

interface UnitStatsProps {
    units: Unit[];
}

export default function UnitStats({ units }: UnitStatsProps) {
    const total = units.length;
    const available = units.filter((u) => u.status === 'Available').length;
    const reserved = units.filter((u) => u.status === 'Reserved').length;
    const sold = units.filter((u) => u.status === 'Sold').length;

    const stats = [
        { label: 'Total Units', value: total, icon: Building, color: 'bg-blue-500' },
        { label: 'Available', value: available, icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Reserved', value: reserved, icon: Lock, color: 'bg-yellow-500' },
        { label: 'Sold', value: sold, icon: DollarSign, color: 'bg-indigo-500' },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.label} className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${stat.color} text-white`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{stat.value}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
