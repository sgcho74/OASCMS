import { Download } from 'lucide-react';
import { downloadJSON, downloadCSV, generateFullBackup } from '@/lib/export-utils';
import { useProjectStore } from '@/store/useProjectStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import { useUnitStore } from '@/store/useUnitStore';
import { useLeadStore } from '@/store/useLeadStore';
import { useReservationStore } from '@/store/useReservationStore';
import { useContractStore } from '@/store/useContractStore';

export default function ExportPanel() {
    const { projects } = useProjectStore();
    const { blocks } = useBlockStore();
    const { buildings } = useBuildingStore();
    const { units } = useUnitStore();
    const { leads } = useLeadStore();
    const { reservations } = useReservationStore();
    const { contracts } = useContractStore();

    const exportOptions = [
        {
            name: 'Projects',
            data: projects,
            columns: ['id', 'name', 'location', 'totalUnits', 'status'],
            count: projects.length
        },
        {
            name: 'Blocks',
            data: blocks,
            columns: ['id', 'projectId', 'code', 'name'],
            count: blocks.length
        },
        {
            name: 'Buildings',
            data: buildings,
            columns: ['id', 'projectId', 'blockId', 'code', 'name'],
            count: buildings.length
        },
        {
            name: 'Units',
            data: units,
            columns: ['id', 'projectId', 'blockId', 'buildingId', 'unitNumber', 'floor', 'typeCode', 'basePrice', 'status'],
            count: units.length
        },
        {
            name: 'Leads',
            data: leads,
            columns: ['id', 'name', 'phone', 'email', 'source', 'status', 'budget'],
            count: leads.length
        },
        {
            name: 'Reservations',
            data: reservations,
            columns: ['id', 'unitId', 'customerName', 'customerPhone', 'reservationDate', 'status'],
            count: reservations.length
        },
        {
            name: 'Contracts',
            data: contracts,
            columns: ['id', 'projectId', 'unitNumber', 'customerName', 'totalAmount', 'status'],
            count: contracts.length
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Individual Entities</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {exportOptions.map((option) => (
                        <div key={option.name} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3">
                                <h4 className="font-medium text-gray-900 dark:text-white">{option.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{option.count} records</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => downloadJSON(option.data, option.name.toLowerCase())}
                                    disabled={option.count === 0}
                                    className="flex flex-1 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    JSON
                                </button>
                                <button
                                    onClick={() => downloadCSV(option.data, option.name.toLowerCase(), option.columns)}
                                    disabled={option.count === 0}
                                    className="flex flex-1 items-center justify-center rounded-md border border-indigo-600 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    CSV
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Full System Backup</h3>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Export all data including Projects, Units, Leads, Contracts, Reservations, and system settings as a single JSON file.
                    </p>
                    <button
                        onClick={generateFullBackup}
                        className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Backup
                    </button>
                </div>
            </div>
        </div>
    );
}
