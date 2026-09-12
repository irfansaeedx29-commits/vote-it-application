import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question, VoteResult } from '../types';
import { submitVote } from '../services/api';
import VoteBar from './VoteBar';

interface QuestionCardProps {
  question: Question;
  /** When true the card is shown on the detail page (slightly different layout) */
  detailed?: boolean;
}

export default function QuestionCard({ question, detailed = false }: QuestionCardProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasVoted = voteResult !== null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function handleVote() {
    if (selectedOptionId === null) return;
    setLoading(true);
    setError(null);
    try {
      const result = await submitVote(question.id, selectedOptionId);
      setVoteResult(result);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">

      {/* Category pill + question text */}
      <div>
        <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2">
          {question.category}
        </span>

        {detailed ? (
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{question.text}</h1>
        ) : (
          <Link
            to={`/questions/${question.id}`}
            className="block text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors no-underline leading-snug"
          >
            {question.text}
          </Link>
        )}
      </div>

      {/* PRE-VOTE: radio options */}
      {!hasVoted && (
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors
                ${selectedOptionId === opt.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt.id}
                checked={selectedOptionId === opt.id}
                onChange={() => setSelectedOptionId(opt.id)}
                className="accent-indigo-600 w-4 h-4"
              />
              <span className="text-sm text-gray-800">{opt.text}</span>
            </label>
          ))}
        </div>
      )}

      {/* PRE-VOTE: Vote button */}
      {!hasVoted && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleVote}
            disabled={selectedOptionId === null || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Voting…' : 'Vote'}
          </button>
          {selectedOptionId === null && (
            <span className="text-xs text-gray-400">Select an option first</span>
          )}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      )}

      {/* POST-VOTE: results */}
      {hasVoted && voteResult && (
        <div className="flex flex-col gap-2">
          {voteResult.results.map((r) => (
            <VoteBar
              key={r.optionId}
              text={r.text}
              percentage={r.percentage}
              votes={r.votes}
              isChosen={r.optionId === voteResult.chosenOptionId}
            />
          ))}
        </div>
      )}

      {/* Footer: total votes + share link */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {hasVoted
            ? `${voteResult!.totalVotes.toLocaleString()} people voted`
            : `${question.totalVotes.toLocaleString()} votes so far`}
        </span>

        {!detailed && (
          <Link
            to={`/questions/${question.id}`}
            className="text-xs text-indigo-500 hover:text-indigo-700 no-underline"
          >
            View →
          </Link>
        )}
      </div>
    </div>
  );
}
