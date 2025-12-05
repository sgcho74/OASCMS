import { useProjectStore } from '@/store/useProjectStore';
import { UnitStatus } from '@/store/useUnitStore';

interface UnitFiltersProps {
    selectedProject: string;
    onProjectChange: (id: string) => void;
    selectedStatus: UnitStatus | 'All';
    onStatusChange: (status: UnitStatus | 'All') => void;
}

export default function UnitFilters({
    selectedProject,
    onProjectChange,
    selectedStatus,
    onStatusChange,
}: UnitFiltersProps) {
    const { projects } = useProjectStore();
    const statuses: (UnitStatus | 'All')[] = ['All', 'Available', 'Reserved', 'Sold', 'OnHold', 'LotteryLocked', 'ContractPending'];

    return (
        <div className="flex flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                <select
                    value={selectedProject}
                    onChange={(e) => onProjectChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    <option value="All">All Projects</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value as UnitStatus | 'All')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
