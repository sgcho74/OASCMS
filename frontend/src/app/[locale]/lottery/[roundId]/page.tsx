'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLotteryStore } from '@/store/useLotteryStore';
import { useUnitStore } from '@/store/useUnitStore';
import { ArrowLeft, Trophy, Users, Ticket, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LotteryRoundDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { rounds } = useLotteryStore();
    const { units } = useUnitStore();

    const roundId = params.roundId as string;
    const round = rounds.find((r) => r.id === roundId);

    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    if (!round) {
        return (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Round Not Found</h2>
                <Link
                    href="/lottery"
                    className="flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Lottery
                </Link>
            </div>
        );
    }

    const winners = round.applicants.filter((a) => a.status === 'won');
    const losers = round.applicants.filter((a) => a.status === 'lost');
    const waitingList = round.waitingList || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/lottery"
                        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{round.name}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: <span className="font-medium text-gray-900 dark:text-gray-200">{round.status.toUpperCase()}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="rounded-md bg-indigo-100 p-3 dark:bg-indigo-900">
                            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applicants</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{round.applicants.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="rounded-md bg-green-100 p-3 dark:bg-green-900">
                            <Trophy className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Winners</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{winners.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="rounded-md bg-yellow-100 p-3 dark:bg-yellow-900">
                            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Waiting List</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{waitingList.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">
                            <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                {round.applicants.length > 0
                                    ? ((winners.length / round.applicants.length) * 100).toFixed(1)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Winners Table */}
            {round.status === 'drawn' && (
                <div className="space-y-6">
                    <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Winners Allocation</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rank</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Applicant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Priority Group</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Assigned Unit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {winners.map((winner, index) => {
                                        const unit = units.find(u => u.id === winner.allocatedUnitId);
                                        return (
                                            <tr key={winner.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    #{index + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{winner.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{winner.phone}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                        {winner.priorityGroup.replace('P', 'Priority ').replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {winner.priorityScore}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {unit ? `Unit ${unit.unitNumber} (${unit.typeCode})` : 'No Unit Assigned'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Waiting List Table */}
                    {waitingList.length > 0 && (
                        <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Waiting List</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Wait Rank</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Applicant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Priority Group</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {waitingList.map((entry) => {
                                            const applicant = round.applicants.find(a => a.id === entry.applicantId);
                                            if (!applicant) return null;

                                            return (
                                                <tr key={entry.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        #{entry.rank}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{applicant.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{applicant.phone}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                            {applicant.priorityGroup.replace('P', 'Priority ').replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        {applicant.priorityScore}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                            {entry.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
