import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../types';
import { fetchQuestions, CATEGORIES } from '../services/api';
import QuestionCard from '../components/QuestionCard';

export default function HomePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Load questions on mount
  useEffect(() => {
    fetchQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  // Filter by category
  const filtered =
    activeCategory === 'All'
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  const allCategories = ['All', ...CATEGORIES];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask anything.</h1>
        <p className="text-lg text-gray-500">Let the internet decide.</p>
        <Link
          to="/create"
          className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors no-underline"
        >
          + Ask a Question
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors font-medium
              ${activeCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Question list */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading questions…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No questions in this category yet.{' '}
          <Link to="/create" className="text-indigo-500 hover:underline">
            Be the first!
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </main>
  );
}
