import { useState, useEffect } from 'react';
import { Unit, useUnitStore } from '@/store/useUnitStore';
import { useProjectStore } from '@/store/useProjectStore';
import { X } from 'lucide-react';

interface EditUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    unitId: string | null;
}

export default function EditUnitModal({ isOpen, onClose, unitId }: EditUnitModalProps) {
    const { units, updateUnit } = useUnitStore();
    const { projects } = useProjectStore();
    const [formData, setFormData] = useState<Partial<Unit>>({});

    useEffect(() => {
        if (unitId) {
            const unit = units.find((u) => u.id === unitId);
            if (unit) {
                setFormData({
                    projectId: unit.projectId,
                    typeCode: unit.typeCode,
                    basePrice: unit.basePrice,
                    unitNumber: unit.unitNumber,
                    floor: unit.floor,
                });
            }
        }
    }, [unitId, units]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (unitId && formData) {
            updateUnit(unitId, formData);
            onClose();
        }
    };

    if (!isOpen || !unitId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Unit</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                        <select
                            value={formData.projectId || ''}
                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select Project</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Number</label>
                        <input
                            type="text"
                            value={formData.unitNumber || ''}
                            onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Floor</label>
                        <input
                            type="number"
                            value={formData.floor || ''}
                            onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type Code</label>
                        <input
                            type="text"
                            value={formData.typeCode || ''}
                            onChange={(e) => setFormData({ ...formData, typeCode: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base Price</label>
                        <input
                            type="number"
                            value={formData.basePrice || ''}
                            onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
