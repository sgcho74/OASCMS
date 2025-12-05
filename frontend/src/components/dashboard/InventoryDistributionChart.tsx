import { useUnitStore } from '@/store/useUnitStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function InventoryDistributionChart() {
    const { units } = useUnitStore();

    const statusCounts = units.reduce((acc, unit) => {
        acc[unit.status] = (acc[unit.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = [
        { name: 'Available', value: statusCounts['Available'] || 0, color: '#10B981' }, // Green
        { name: 'Reserved', value: statusCounts['Reserved'] || 0, color: '#F59E0B' },  // Yellow
        { name: 'Sold', value: statusCounts['Sold'] || 0, color: '#4F46E5' },      // Indigo
        { name: 'OnHold', value: statusCounts['OnHold'] || 0, color: '#EF4444' },    // Red
    ].filter(item => item.value > 0);

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white">Inventory Status</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            itemStyle={{ color: '#F3F4F6' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
