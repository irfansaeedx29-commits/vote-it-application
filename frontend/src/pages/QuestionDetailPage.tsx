import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Question } from '../types';
import { fetchQuestion } from '../services/api';
import QuestionCard from '../components/QuestionCard';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchQuestion(id).then((data) => {
      if (!data) setNotFound(true);
      else setQuestion(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading…
      </main>
    );
  }

  if (notFound || !question) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-2">Question not found</p>
        <p className="text-gray-500 mb-6">It may have been removed or the link is invalid.</p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg no-underline hover:bg-indigo-700 transition-colors"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="text-sm text-indigo-500 hover:text-indigo-700 no-underline">
          ← All questions
        </Link>
      </div>

      {/* Question card in "detailed" mode — heading is an <h1>, no "View →" link */}
      <QuestionCard question={question} detailed />

      {/* Share nudge */}
      <p className="mt-6 text-sm text-gray-400 text-center">
        Share this question:{' '}
        <span className="font-mono text-gray-600 select-all">
          {window.location.href}
        </span>
      </p>
    </main>
  );
}
