import { useContractStore } from '@/store/useContractStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function SalesTrendChart() {
    const { contracts } = useContractStore();

    // Generate last 6 months data
    const data = Array.from({ length: 6 }).map((_, i) => {
        const date = subMonths(new Date(), 5 - i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const monthName = format(date, 'MMM');

        const monthlyContracts = contracts.filter((c) => {
            const contractDate = new Date(c.contractDate);
            return isWithinInterval(contractDate, { start: monthStart, end: monthEnd });
        });

        const revenue = monthlyContracts.reduce((sum, c) => sum + c.totalAmount, 0);

        return {
            name: monthName,
            Sales: monthlyContracts.length,
            Revenue: revenue,
        };
    });

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white">Sales Trend (Last 6 Months)</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis yAxisId="left" orientation="left" stroke="#9CA3AF" />
                        <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            itemStyle={{ color: '#F3F4F6' }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="Sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
