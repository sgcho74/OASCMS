import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UnitStatus =
  | 'Available'
  | 'Reserved'
  | 'Sold'
  | 'OnHold'
  | 'LotteryLocked'
  | 'ContractPending';

export interface Unit {
  id: string;
  projectId: string;
  blockId: string;
  buildingId: string;
  typeCode: string; // "84A", "59B"
  floor: number;
  unitNumber: string; // "101", "102"
  viewType?: string; // "South", "Park View"
  netAreaSqm?: number; // 전용면적
  grossAreaSqm?: number; // 공급면적
  basePrice: number;
  status: UnitStatus;
  reservedBy?: string; // customer name
  soldTo?: string; // customer name
  createdAt: string;
}

interface UnitState {
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt'>) => void;
  updateUnit: (id: string, data: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  getUnitsByBuilding: (buildingId: string) => Unit[];
  getUnitsByProject: (projectId: string) => Unit[];
  getAvailableUnits: (projectId?: string) => Unit[];
  bulkAddUnits: (units: Omit<Unit, 'id' | 'createdAt'>[]) => void;
  setUnitStatus: (ids: string[], status: UnitStatus) => void;
}

export const useUnitStore = create<UnitState>()(
  persist(
    (set, get) => ({
      units: [],
      addUnit: (data) =>
        set((state) => ({
          units: [
            ...state.units,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateUnit: (id, data) =>
        set((state) => ({
          units: state.units.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),
      deleteUnit: (id) =>
        set((state) => ({
          units: state.units.filter((u) => u.id !== id),
        })),
      getUnitsByBuilding: (buildingId) =>
        get().units.filter((u) => u.buildingId === buildingId),
      getUnitsByProject: (projectId) =>
        get().units.filter((u) => u.projectId === projectId),
      getAvailableUnits: (projectId) => {
        const units = get().units;
        return projectId
          ? units.filter((u) => u.projectId === projectId && u.status === 'Available')
          : units.filter((u) => u.status === 'Available');
      },
      bulkAddUnits: (newUnits) =>
        set((state) => ({
          units: [
            ...state.units,
            ...newUnits.map((u) => ({
              ...u,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            })),
          ],
        })),
      setUnitStatus: (ids, status) =>
        set((state) => ({
          units: state.units.map((u) =>
            ids.includes(u.id) ? { ...u, status } : u
          ),
        })),
    }),
    {
      name: 'oascms-units',
    }
  )
);
