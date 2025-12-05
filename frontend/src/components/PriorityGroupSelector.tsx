import { PriorityGroup } from '@/store/useLotteryStore';
import { Users, Award, MapPin, User } from 'lucide-react';

interface PriorityGroupSelectorProps {
    value: PriorityGroup;
    onChange: (value: PriorityGroup) => void;
}

export default function PriorityGroupSelector({ value, onChange }: PriorityGroupSelectorProps) {
    const groups: { id: PriorityGroup; label: string; icon: any; desc: string }[] = [
        {
            id: 'P1_FIRST_TIME',
            label: 'First-Time Buyer',
            icon: Award,
            desc: 'Highest Priority - Never owned property'
        },
        {
            id: 'P2_VETERAN',
            label: 'Veteran / Disabled',
            icon: Users,
            desc: 'Priority 2 - Service members & disabled'
        },
        {
            id: 'P3_LOCAL',
            label: 'Local Resident',
            icon: MapPin,
            desc: 'Priority 3 - Residents of the region'
        },
        {
            id: 'P4_GENERAL',
            label: 'General Applicant',
            icon: User,
            desc: 'Standard Priority - General public'
        },
    ];

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority Group
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        onClick={() => onChange(group.id)}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md
              ${value === group.id
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                                : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-indigo-300'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`rounded-full p-2 
                ${value === group.id ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                <group.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className={`font-medium ${value === group.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {group.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{group.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
