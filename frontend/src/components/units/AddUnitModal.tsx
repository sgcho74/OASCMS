import { useState, useEffect } from 'react';
import { useUnitStore, UnitStatus } from '@/store/useUnitStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AddUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddUnitModal({ isOpen, onClose }: AddUnitModalProps) {
    const t = useTranslations('Units');
    const tCommon = useTranslations('Common');
    const { addUnit } = useUnitStore();
    const { projects } = useProjectStore();
    const { blocks } = useBlockStore();
    const { buildings } = useBuildingStore();

    const [projectId, setProjectId] = useState('');
    const [blockId, setBlockId] = useState('');
    const [buildingId, setBuildingId] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [floor, setFloor] = useState('');
    const [typeCode, setTypeCode] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [status, setStatus] = useState<UnitStatus>('Available');

    // Filtered options
    const filteredBlocks = blocks.filter(b => b.projectId === projectId);
    const filteredBuildings = buildings.filter(b => b.blockId === blockId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUnit({
            projectId,
            blockId,
            buildingId,
            unitNumber,
            floor: Number(floor),
            typeCode,
            basePrice: Number(basePrice),
            status,
        });
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setProjectId('');
        setBlockId('');
        setBuildingId('');
        setUnitNumber('');
        setFloor('');
        setTypeCode('');
        setBasePrice('');
        setStatus('Available');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('addUnit')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('projects')}</label>
                        <select
                            required
                            value={projectId}
                            onChange={(e) => {
                                setProjectId(e.target.value);
                                setBlockId('');
                                setBuildingId('');
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select Project</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Block Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('blocks')}</label>
                        <select
                            required
                            value={blockId}
                            onChange={(e) => {
                                setBlockId(e.target.value);
                                setBuildingId('');
                            }}
                            disabled={!projectId}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="">Select Block</option>
                            {filteredBlocks.map((b) => (
                                <option key={b.id} value={b.id}>{b.blockName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Building Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('buildings')}</label>
                        <select
                            required
                            value={buildingId}
                            onChange={(e) => setBuildingId(e.target.value)}
                            disabled={!blockId}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="">Select Building</option>
                            {filteredBuildings.map((b) => (
                                <option key={b.id} value={b.id}>{b.buildingNo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Number</label>
                            <input
                                type="text"
                                required
                                value={unitNumber}
                                onChange={(e) => setUnitNumber(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="e.g. 101"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Floor</label>
                            <input
                                type="number"
                                required
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type Code</label>
                            <input
                                type="text"
                                required
                                value={typeCode}
                                onChange={(e) => setTypeCode(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="e.g. 84A"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base Price</label>
                            <input
                                type="number"
                                required
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('status')}</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as UnitStatus)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Sold">Sold</option>
                            <option value="OnHold">On Hold</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            {tCommon('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            {tCommon('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
