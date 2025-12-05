import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---

export type PriorityGroup = 'P1_FIRST_TIME' | 'P2_VETERAN' | 'P3_LOCAL' | 'P4_GENERAL';

export interface ApplicantProfile {
  age: number;
  familySize: number;
  yearsOfResidence: number; // For P3_LOCAL scoring
  isFirstTimeBuyer: boolean;
}

export interface UnitPreference {
  unitId: string;
  rank: 1 | 2 | 3;
}

export interface Applicant {
  id: string;
  name: string;
  phone: string;
  email: string;
  priorityGroup: PriorityGroup;
  profile: ApplicantProfile;
  priorityScore: number; // Calculated score
  preferences: UnitPreference[];
  status: 'pending' | 'won' | 'lost';
  allocatedUnitId?: string; // If won
}

export interface DrawResult {
  applicantId: string;
  allocatedUnitId?: string;
  preferenceRank?: 1 | 2 | 3;
  reason: 'ALLOCATED' | 'WAITING_LIST' | 'NO_UNITS';
}

export interface WaitingListEntry {
  id: string;
  roundId: string;
  applicantId: string;
  rank: number;
  createdAt: string;
  status: 'active' | 'promoted' | 'expired';
}

export interface LotteryRound {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  totalWinners: number;
  status: 'open' | 'closed' | 'drawn';
  applicants: Applicant[];
  availableUnits: string[]; // Unit IDs available for this round
  drawResults: DrawResult[];
  waitingList: WaitingListEntry[];
}

interface LotteryState {
  rounds: LotteryRound[];
  addRound: (round: Omit<LotteryRound, 'id' | 'status' | 'applicants' | 'drawResults' | 'waitingList'>) => void;
  addApplicant: (roundId: string, applicant: Omit<Applicant, 'id' | 'status' | 'priorityScore' | 'allocatedUnitId'>) => void;
  drawWinners: (roundId: string) => void;
}

// --- Helpers ---

export const calculatePriorityScore = (profile: ApplicantProfile, priorityGroup: PriorityGroup): number => {
  let score = 0;

  // Age Score
  if (profile.age >= 65) score += 20;
  else if (profile.age >= 50) score += 15;
  else if (profile.age >= 35) score += 10;
  else score += 5;

  // Family Size Score
  if (profile.familySize >= 5) score += 15;
  else if (profile.familySize >= 3) score += 10;
  else score += 5;

  // Residence Score (Max 20)
  score += Math.min(profile.yearsOfResidence, 20);

  // First Time Buyer Bonus
  if (profile.isFirstTimeBuyer) score += 10;

  return score;
};

const PRIORITY_ORDER: Record<PriorityGroup, number> = {
  'P1_FIRST_TIME': 1,
  'P2_VETERAN': 2,
  'P3_LOCAL': 3,
  'P4_GENERAL': 4,
};

// --- Store ---

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set) => ({
      rounds: [],
      addRound: (data) =>
        set((state) => ({
          rounds: [
            ...state.rounds,
            {
              ...data,
              id: crypto.randomUUID(),
              status: 'open',
              applicants: [],
              drawResults: [],
              waitingList: [],
            },
          ],
        })),
      addApplicant: (roundId, data) =>
        set((state) => ({
          rounds: state.rounds.map((round) =>
            round.id === roundId
              ? {
                ...round,
                applicants: [
                  ...round.applicants,
                  {
                    ...data,
                    id: crypto.randomUUID(),
                    status: 'pending',
                    priorityScore: calculatePriorityScore(data.profile, data.priorityGroup),
                  },
                ],
              }
              : round
          ),
        })),
      drawWinners: (roundId) =>
        set((state) => ({
          rounds: state.rounds.map((round) => {
            if (round.id !== roundId) return round;

            // 1. Sort Applicants: Priority Group (asc) -> Score (desc)
            const sortedApplicants = [...round.applicants].sort((a, b) => {
              const priorityDiff = PRIORITY_ORDER[a.priorityGroup] - PRIORITY_ORDER[b.priorityGroup];
              if (priorityDiff !== 0) return priorityDiff;
              return b.priorityScore - a.priorityScore; // Higher score first
            });

            const drawResults: DrawResult[] = [];
            const waitingList: WaitingListEntry[] = [];
            const allocatedUnits = new Set<string>();
            const updatedApplicants: Applicant[] = [];

            // 2. Allocation Logic
            sortedApplicants.forEach((applicant) => {
              let allocatedUnitId: string | undefined;
              let preferenceRank: 1 | 2 | 3 | undefined;

              // Try to allocate based on preferences
              for (const pref of applicant.preferences) {
                if (round.availableUnits.includes(pref.unitId) && !allocatedUnits.has(pref.unitId)) {
                  allocatedUnitId = pref.unitId;
                  preferenceRank = pref.rank;
                  allocatedUnits.add(pref.unitId);
                  break;
                }
              }

              // If allocated
              if (allocatedUnitId) {
                drawResults.push({
                  applicantId: applicant.id,
                  allocatedUnitId,
                  preferenceRank,
                  reason: 'ALLOCATED',
                });
                updatedApplicants.push({
                  ...applicant,
                  status: 'won',
                  allocatedUnitId,
                });
              } else {
                // Add to Waiting List
                drawResults.push({
                  applicantId: applicant.id,
                  reason: 'WAITING_LIST',
                });
                waitingList.push({
                  id: crypto.randomUUID(),
                  roundId: round.id,
                  applicantId: applicant.id,
                  rank: waitingList.length + 1,
                  createdAt: new Date().toISOString(),
                  status: 'active',
                });
                updatedApplicants.push({
                  ...applicant,
                  status: 'lost',
                });
              }
            });

            return {
              ...round,
              status: 'drawn',
              applicants: updatedApplicants,
              drawResults,
              waitingList,
            };
          }),
        })),
    }),
    {
      name: 'oascms-lottery',
    }
  )
);
