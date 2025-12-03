'use client';

import { useProjectStore } from '@/store/useProjectStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import { useUnitStore } from '@/store/useUnitStore';

interface Props {
  value: {
    projectId?: string;
    blockId?: string;
    buildingId?: string;
    unitId?: string;
  };
  onChange: (value: {
    projectId?: string;
    blockId?: string;
    buildingId?: string;
    unitId?: string;
  }) => void;
  level?: 'project' | 'block' | 'building' | 'unit';
}

export default function HierarchicalSelector({ value, onChange, level = 'unit' }: Props) {
  const { projects } = useProjectStore();
  const { getBlocksByProject } = useBlockStore();
  const { getBuildingsByBlock } = useBuildingStore();
  const { getUnitsByBuilding } = useUnitStore();

  const blocks = value.projectId ? getBlocksByProject(value.projectId) : [];
  const buildings = value.blockId ? getBuildingsByBlock(value.blockId) : [];
  const units = value.buildingId ? getUnitsByBuilding(value.buildingId) : [];

  return (
    <div className="space-y-4">
      {/* Project */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
        <select
          value={value.projectId || ''}
          onChange={(e) => onChange({ projectId: e.target.value })}
          className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.location})
            </option>
          ))}
        </select>
      </div>

      {/* Block */}
      {level !== 'project' && value.projectId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
          <select
            value={value.blockId || ''}
            onChange={(e) =>
              onChange({ ...value, blockId: e.target.value, buildingId: undefined, unitId: undefined })
            }
            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm"
          >
            <option value="">Select Block</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.blockName} ({b.blockCode})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Building */}
      {level !== 'project' && level !== 'block' && value.blockId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
          <select
            value={value.buildingId || ''}
            onChange={(e) =>
              onChange({ ...value, buildingId: e.target.value, unitId: undefined })
            }
            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm"
          >
            <option value="">Select Building</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                Building {b.buildingNo} ({b.floors}F)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Unit */}
      {level === 'unit' && value.buildingId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select
            value={value.unitId || ''}
            onChange={(e) => onChange({ ...value, unitId: e.target.value })}
            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm"
          >
            <option value="">Select Unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.unitNumber} - {u.typeCode} ({u.status})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
