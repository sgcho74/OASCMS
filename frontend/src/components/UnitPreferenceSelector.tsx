import { useState } from 'react';
import { UnitPreference } from '@/store/useLotteryStore';
import { useUnitStore } from '@/store/useUnitStore';
import { Plus, X, Building } from 'lucide-react';

interface UnitPreferenceSelectorProps {
    projectId: string;
    value: UnitPreference[];
    onChange: (value: UnitPreference[]) => void;
}

export default function UnitPreferenceSelector({ projectId, value, onChange }: UnitPreferenceSelectorProps) {
    const { units } = useUnitStore();
    const [selectedUnitId, setSelectedUnitId] = useState('');

    // Filter available units for this project
    const availableUnits = units.filter(
        (u) => u.projectId === projectId && u.status === 'Available'
    );

    const handleAdd = () => {
        if (!selectedUnitId) return;
        if (value.length >= 3) return;
        if (value.some((p) => p.unitId === selectedUnitId)) return;

        const newRank = (value.length + 1) as 1 | 2 | 3;
        onChange([...value, { unitId: selectedUnitId, rank: newRank }]);
        setSelectedUnitId('');
    };

    const handleRemove = (unitId: string) => {
        const newValue = value
            .filter((p) => p.unitId !== unitId)
            .map((p, index) => ({ ...p, rank: (index + 1) as 1 | 2 | 3 }));
        onChange(newValue);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Unit Preferences (Max 3)
            </label>

            {/* Selector */}
            <div className="flex space-x-2">
                <select
                    value={selectedUnitId}
                    onChange={(e) => setSelectedUnitId(e.target.value)}
                    disabled={value.length >= 3}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Select Unit...</option>
                    {availableUnits.map((unit) => (
                        <option key={unit.id} value={unit.id} disabled={value.some(p => p.unitId === unit.id)}>
                            Unit {unit.unitNumber} ({unit.typeCode}) - ${unit.basePrice.toLocaleString()}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!selectedUnitId || value.length >= 3}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {/* Selected List */}
            <div className="space-y-2">
                {value.map((pref) => {
                    const unit = units.find((u) => u.id === pref.unitId);
                    return (
                        <div key={pref.unitId} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                                    {pref.rank}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Unit {unit?.unitNumber || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {unit?.typeCode} • ${unit?.basePrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(pref.unitId)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
                {value.length === 0 && (
                    <div className="rounded-md border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        No preferences selected. Random allocation will apply if no preferences are set.
                    </div>
                )}
            </div>
        </div>
    );
}
