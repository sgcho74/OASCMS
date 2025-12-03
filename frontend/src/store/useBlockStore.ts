import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Block {
  id: string;
  projectId: string;
  blockCode: string; // e.g. "A", "B", "1지구"
  blockName: string;
  phaseNo?: number; // 1차, 2차
  status: 'Planned' | 'OnSale' | 'Closed';
  createdAt: string;
}

interface BlockState {
  blocks: Block[];
  addBlock: (block: Omit<Block, 'id' | 'createdAt'>) => void;
  updateBlock: (id: string, data: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  getBlocksByProject: (projectId: string) => Block[];
}

export const useBlockStore = create<BlockState>()(
  persist(
    (set, get) => ({
      blocks: [],
      addBlock: (data) =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateBlock: (id, data) =>
        set((state) => ({
          blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...data } : b)),
        })),
      deleteBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        })),
      getBlocksByProject: (projectId) =>
        get().blocks.filter((b) => b.projectId === projectId),
    }),
    {
      name: 'oascms-blocks',
    }
  )
);
