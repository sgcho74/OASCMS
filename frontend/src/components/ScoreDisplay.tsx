interface ScoreDisplayProps {
    score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/30">
            <div>
                <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Total Priority Score</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-400">Based on profile data</p>
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                {score} <span className="text-sm font-normal text-indigo-400">pts</span>
            </div>
        </div>
    );
}
