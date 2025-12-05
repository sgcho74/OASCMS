import { ApplicantProfile } from '@/store/useLotteryStore';

interface ApplicantProfileFormProps {
    value: ApplicantProfile;
    onChange: (value: ApplicantProfile) => void;
}

export default function ApplicantProfileForm({ value, onChange }: ApplicantProfileFormProps) {
    const handleChange = (field: keyof ApplicantProfile, val: any) => {
        onChange({ ...value, [field]: val });
    };

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Scoring Profile</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Age</label>
                    <input
                        type="number"
                        min="18"
                        max="120"
                        value={value.age}
                        onChange={(e) => handleChange('age', Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Family Size</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={value.familySize}
                        onChange={(e) => handleChange('familySize', Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Years of Residence</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={value.yearsOfResidence}
                        onChange={(e) => handleChange('yearsOfResidence', Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="flex items-center pt-5">
                    <input
                        type="checkbox"
                        id="isFirstTimeBuyer"
                        checked={value.isFirstTimeBuyer}
                        onChange={(e) => handleChange('isFirstTimeBuyer', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="isFirstTimeBuyer" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        First-Time Buyer
                    </label>
                </div>
            </div>
        </div>
    );
}
