'use client';

import { useState, useEffect } from 'react';
import { useLotteryStore, LotteryRound, PriorityGroup, ApplicantProfile, UnitPreference, calculatePriorityScore } from '@/store/useLotteryStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useUnitStore } from '@/store/useUnitStore';
import { Plus, Ticket, Users, Trophy, Play, Award, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import PriorityGroupSelector from '@/components/PriorityGroupSelector';
import ApplicantProfileForm from '@/components/ApplicantProfileForm';
import UnitPreferenceSelector from '@/components/UnitPreferenceSelector';
import ScoreDisplay from '@/components/ScoreDisplay';

export default function LotteryPage() {
  const { rounds, addRound, addApplicant, drawWinners } = useLotteryStore();
  const { projects } = useProjectStore();
  const { units } = useUnitStore();

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
  const [priorityGroup, setPriorityGroup] = useState<PriorityGroup>('P4_GENERAL');
  const [profile, setProfile] = useState<ApplicantProfile>({
    age: 30,
    familySize: 1,
    yearsOfResidence: 0,
    isFirstTimeBuyer: false,
  });
  const [preferences, setPreferences] = useState<UnitPreference[]>([]);

  // Hydration fix
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleRoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Automatically select all available units for this project
    const availableUnits = units
      .filter(u => u.projectId === projectId && u.status === 'Available')
      .map(u => u.id);

    addRound({
      projectId,
      name: roundName,
      startDate,
      endDate,
      totalWinners: Number(totalWinners),
      availableUnits,
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
        priorityGroup,
        profile,
        preferences,
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
    setPriorityGroup('P4_GENERAL');
    setProfile({
      age: 30,
      familySize: 1,
      yearsOfResidence: 0,
      isFirstTimeBuyer: false,
    });
    setPreferences([]);
  };

  const currentScore = calculatePriorityScore(profile, priorityGroup);

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lottery System</h1>
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

          return (
            <div key={round.id} className="rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{round.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project?.name}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium
                    ${round.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      round.status === 'drawn' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {round.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <Users className="mx-auto h-5 w-5 text-gray-400 dark:text-gray-300" />
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{round.applicants.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Applicants</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <Trophy className="mx-auto h-5 w-5 text-yellow-500" />
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{round.totalWinners}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Winners</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <Ticket className="mx-auto h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {((round.totalWinners / (round.applicants.length || 1)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Odds</p>
                  </div>
                </div>

                {round.status === 'drawn' && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Winners</h4>
                    <div className="max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
                      {round.applicants.filter(a => a.status === 'won').map(winner => (
                        <div key={winner.id} className="flex items-center justify-between py-1 px-2 text-sm">
                          <span className="font-medium text-gray-900 dark:text-gray-200">{winner.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {winner.allocatedUnitId ? 'Unit Assigned' : 'No Unit'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between dark:bg-gray-800/50">
                <button
                  onClick={() => {
                    setSelectedRoundId(round.id);
                    setIsApplicantModalOpen(true);
                  }}
                  disabled={round.status !== 'open'}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900 disabled:opacity-50 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Add Applicant
                </button>

                <Link
                  href={`/lottery/${round.id}`}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  View Details
                </Link>

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
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create Lottery Round</h2>
            <form onSubmit={handleRoundSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                <select
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Round Name</label>
                <input
                  type="text"
                  required
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Winners</label>
                <input
                  type="number"
                  required
                  value={totalWinners}
                  onChange={(e) => setTotalWinners(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsRoundModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Applicant</h2>
            <form onSubmit={handleApplicantSubmit} className="space-y-6">

              {/* Basic Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Priority & Scoring */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <PriorityGroupSelector value={priorityGroup} onChange={setPriorityGroup} />
                <div className="space-y-4">
                  <ApplicantProfileForm value={profile} onChange={setProfile} />
                  <ScoreDisplay score={currentScore} />
                </div>
              </div>

              {/* Unit Preferences */}
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <UnitPreferenceSelector
                  projectId={rounds.find(r => r.id === selectedRoundId)?.projectId || ''}
                  value={preferences}
                  onChange={setPreferences}
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsApplicantModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
