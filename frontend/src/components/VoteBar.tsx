// VoteBar — a single percentage bar shown after voting
interface VoteBarProps {
  text: string;
  percentage: number;
  votes: number;
  isChosen: boolean;
}

export default function VoteBar({ text, percentage, votes, isChosen }: VoteBarProps) {
  return (
    <div className={`rounded-lg p-3 ${isChosen ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${isChosen ? 'text-indigo-700' : 'text-gray-800'}`}>
          {text}
          {isChosen && (
            <span className="ml-2 text-xs font-normal text-indigo-500">✓ your vote</span>
          )}
        </span>
        <span className={`text-sm font-semibold ${isChosen ? 'text-indigo-700' : 'text-gray-600'}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isChosen ? 'bg-indigo-500' : 'bg-gray-400'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-1">{votes.toLocaleString()} votes</p>
    </div>
  );
}
