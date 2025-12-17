import { useLeadStore } from '@/store/useLeadStore';
import { UserPlus, Phone, CheckCircle, XCircle } from 'lucide-react';

export default function LeadStats() {
    const { leads } = useLeadStore();

    const newLeads = leads.filter((l) => l.status === 'New').length;
    const qualified = leads.filter((l) => l.status === 'Qualified').length;
    const converted = leads.filter((l) => l.status === 'Converted').length;
    const lost = leads.filter((l) => l.status === 'Lost').length;
    const conversionRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0;

    const stats = [
        { name: 'New Leads', value: newLeads, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { name: 'Qualified', value: qualified, icon: Phone, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { name: 'Converted', value: `${converted} (${conversionRate}%)`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { name: 'Lost', value: lost, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
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
