import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-gray-900 no-underline hover:text-indigo-600 transition-colors">
          VoteIt
          <span className="ml-2 text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            beta
          </span>
        </Link>

        {/* Tagline — hidden on small screens */}
        <p className="hidden sm:block text-sm text-gray-400 italic">
          Ask anything. Let the internet decide.
        </p>

        {/* Ask a question CTA */}
        <Link
          to="/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline"
        >
          + Ask a Question
        </Link>
      </div>
    </header>
  );
}
