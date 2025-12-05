'use client';

import { useState, useEffect } from 'react';
import { useUnitStore, UnitStatus } from '@/store/useUnitStore';
import { useProjectStore } from '@/store/useProjectStore';
import UnitStats from '@/components/units/UnitStats';
import UnitFilters from '@/components/units/UnitFilters';
import UnitDataGrid from '@/components/units/UnitDataGrid';
import CsvUploadModal from '@/components/units/CsvUploadModal';
import EditUnitModal from '@/components/units/EditUnitModal';
import AddUnitModal from '@/components/units/AddUnitModal';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UnitsPage() {
  const t = useTranslations('Units');
  const tCommon = useTranslations('Common');
  const { units, deleteUnit, setUnitStatus } = useUnitStore();
  const { projects } = useProjectStore();

  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | 'All'>('All');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filter Units
  const filteredUnits = units.filter((unit) => {
    const matchesProject = selectedProject === 'All' || unit.projectId === selectedProject;
    const matchesStatus = selectedStatus === 'All' || unit.status === selectedStatus;
    return matchesProject && matchesStatus;
  });

  // Selection Handlers
  const handleSelectUnit = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedUnits((prev) => [...prev, id]);
    } else {
      setSelectedUnits((prev) => prev.filter((uid) => uid !== id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUnits(filteredUnits.map((u) => u.id));
    } else {
      setSelectedUnits([]);
    }
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedUnits.length} units?`)) {
      selectedUnits.forEach((id) => deleteUnit(id));
      setSelectedUnits([]);
    }
  };

  const handleBulkStatusUpdate = (status: UnitStatus) => {
    setUnitStatus(selectedUnits, status);
    setSelectedUnits([]);
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            {t('importCsv')}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('addUnit')}
          </button>
        </div>
      </div>

      <UnitStats units={units} />

      <UnitFilters
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Bulk Actions Toolbar */}
      {selectedUnits.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-3 dark:bg-indigo-900/20">
          <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
            {t('unitsSelected', { count: selectedUnits.length })}
          </span>
          <div className="flex space-x-2">
            <select
              onChange={(e) => handleBulkStatusUpdate(e.target.value as UnitStatus)}
              className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              defaultValue=""
            >
              <option value="" disabled>{t('setStatus')}</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="OnHold">On Hold</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="flex items-center rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              {tCommon('delete')}
            </button>
          </div>
        </div>
      )}

      <UnitDataGrid
        units={filteredUnits}
        selectedUnits={selectedUnits}
        onSelectUnit={handleSelectUnit}
        onSelectAll={handleSelectAll}
        onDelete={deleteUnit}
        onStatusUpdate={(id, status) => setUnitStatus([id], status)}
        onEdit={(id) => setEditingUnitId(id)}
      />

      <CsvUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditUnitModal
        isOpen={!!editingUnitId}
        onClose={() => setEditingUnitId(null)}
        unitId={editingUnitId}
      />
    </div>
  );
}
