import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Applicant {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'pending' | 'won' | 'lost';
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
}

interface LotteryState {
  rounds: LotteryRound[];
  addRound: (round: Omit<LotteryRound, 'id' | 'status' | 'applicants'>) => void;
  addApplicant: (roundId: string, applicant: Omit<Applicant, 'id' | 'status'>) => void;
  drawWinners: (roundId: string) => void;
}

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

            const shuffled = [...round.applicants].sort(() => 0.5 - Math.random());
            const winners = shuffled.slice(0, round.totalWinners).map((a) => a.id);

            return {
              ...round,
              status: 'drawn',
              applicants: round.applicants.map((applicant) => ({
                ...applicant,
                status: winners.includes(applicant.id) ? 'won' : 'lost',
              })),
            };
          }),
        })),
    }),
    {
      name: 'oascms-lottery',
    }
  )
);
