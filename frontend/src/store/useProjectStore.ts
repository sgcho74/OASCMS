import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProjectStatus = 'planning' | 'construction' | 'completed' | 'sold_out';

export interface Project {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  status: ProjectStatus;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (data) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
    }),
    {
      name: 'oascms-projects', // unique name for localStorage key
    }
  )
);
