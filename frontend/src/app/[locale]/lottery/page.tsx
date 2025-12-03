'use client';

import { useState, useEffect } from 'react';
import { useLotteryStore, LotteryRound } from '@/store/useLotteryStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Plus, Ticket, Users, Trophy, Play } from 'lucide-react';

export default function LotteryPage() {
  const { rounds, addRound, addApplicant, drawWinners } = useLotteryStore();
  const { projects } = useProjectStore();
  
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  // Round Form
  const [projectId, setProjectId] = useState('');
  const [roundName, setRoundName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalWinners, setTotalWinners] = useState('');

  // Applicant Form
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  // Hydration fix
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleRoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRound({
      projectId,
      name: roundName,
      startDate,
      endDate,
      totalWinners: Number(totalWinners),
    });
    setIsRoundModalOpen(false);
    resetRoundForm();
  };

  const handleApplicantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoundId) {
      addApplicant(selectedRoundId, {
        name: applicantName,
        phone: applicantPhone,
        email: applicantEmail,
      });
      setIsApplicantModalOpen(false);
      resetApplicantForm();
    }
  };

  const resetRoundForm = () => {
    setProjectId('');
    setRoundName('');
    setStartDate('');
    setEndDate('');
    setTotalWinners('');
  };

  const resetApplicantForm = () => {
    setApplicantName('');
    setApplicantPhone('');
    setApplicantEmail('');
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lottery System</h1>
        <button
          onClick={() => setIsRoundModalOpen(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Round
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {rounds.map((round) => {
          const project = projects.find((p) => p.id === round.projectId);
          const winnerCount = round.applicants.filter((a) => a.status === 'won').length;

          return (
            <div key={round.id} className="rounded-lg border bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{round.name}</h3>
                    <p className="text-sm text-gray-500">{project?.name}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium
                    ${round.status === 'open' ? 'bg-green-100 text-green-800' :
                      round.status === 'drawn' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {round.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <Users className="mx-auto h-5 w-5 text-gray-400" />
                    <p className="mt-1 text-lg font-semibold text-gray-900">{round.applicants.length}</p>
                    <p className="text-xs text-gray-500">Applicants</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <Trophy className="mx-auto h-5 w-5 text-yellow-500" />
                    <p className="mt-1 text-lg font-semibold text-gray-900">{round.totalWinners}</p>
                    <p className="text-xs text-gray-500">Winners</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <Ticket className="mx-auto h-5 w-5 text-indigo-500" />
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {((round.totalWinners / (round.applicants.length || 1)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">Odds</p>
                  </div>
                </div>

                {round.status === 'drawn' && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Winners</h4>
                    <div className="max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-2">
                      {round.applicants.filter(a => a.status === 'won').map(winner => (
                        <div key={winner.id} className="flex items-center justify-between py-1 px-2 text-sm">
                          <span className="font-medium text-gray-900">{winner.name}</span>
                          <span className="text-gray-500">{winner.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between">
                <button
                  onClick={() => {
                    setSelectedRoundId(round.id);
                    setIsApplicantModalOpen(true);
                  }}
                  disabled={round.status !== 'open'}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                >
                  Add Applicant
                </button>
                
                {round.status === 'open' && (
                  <button
                    onClick={() => drawWinners(round.id)}
                    className="flex items-center text-sm font-medium text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700"
                  >
                    <Play className="mr-1.5 h-4 w-4" />
                    Draw Winners
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Round Modal */}
      {isRoundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Create Lottery Round</h2>
            <form onSubmit={handleRoundSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Round Name</label>
                <input
                  type="text"
                  required
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Winners</label>
                <input
                  type="number"
                  required
                  value={totalWinners}
                  onChange={(e) => setTotalWinners(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsRoundModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Create Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Applicant Modal */}
      {isApplicantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Add Applicant</h2>
            <form onSubmit={handleApplicantSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsApplicantModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
