import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Building {
  id: string;
  projectId: string;
  blockId: string;
  buildingNo: string; // "101", "102", "B-2"
  floors: number;
  totalUnits?: number;
  status: 'Planned' | 'UnderConstruction' | 'Completed';
  createdAt: string;
}

interface BuildingState {
  buildings: Building[];
  addBuilding: (building: Omit<Building, 'id' | 'createdAt'>) => void;
  updateBuilding: (id: string, data: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  getBuildingsByBlock: (blockId: string) => Building[];
  getBuildingsByProject: (projectId: string) => Building[];
}

export const useBuildingStore = create<BuildingState>()(
  persist(
    (set, get) => ({
      buildings: [],
      addBuilding: (data) =>
        set((state) => ({
          buildings: [
            ...state.buildings,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateBuilding: (id, data) =>
        set((state) => ({
          buildings: state.buildings.map((b) => (b.id === id ? { ...b, ...data } : b)),
        })),
      deleteBuilding: (id) =>
        set((state) => ({
          buildings: state.buildings.filter((b) => b.id !== id),
        })),
      getBuildingsByBlock: (blockId) =>
        get().buildings.filter((b) => b.blockId === blockId),
      getBuildingsByProject: (projectId) =>
        get().buildings.filter((b) => b.projectId === projectId),
    }),
    {
      name: 'oascms-buildings',
    }
  )
);
