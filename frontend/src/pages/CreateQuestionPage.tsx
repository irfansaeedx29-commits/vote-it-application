import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createQuestion, CATEGORIES } from '../services/api';

// ── Validation rules from the spec ─────────────────────────────────────────
const QUESTION_MIN = 10;
const QUESTION_MAX = 200;
const OPTION_MIN = 1;
const OPTION_MAX = 100;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

export default function CreateQuestionPage() {
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState(['', '']);  // start with 2 empty options
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Option helpers ─────────────────────────────────────────────────────────
  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  function addOption() {
    if (options.length < MAX_OPTIONS) {
      setOptions((prev) => [...prev, '']);
    }
  }

  function removeOption(index: number) {
    if (options.length > MIN_OPTIONS) {
      setOptions((prev) => prev.filter((_, i) => i !== index));
    }
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (questionText.trim().length < QUESTION_MIN) {
      newErrors.question = `Question must be at least ${QUESTION_MIN} characters.`;
    } else if (questionText.trim().length > QUESTION_MAX) {
      newErrors.question = `Question must be at most ${QUESTION_MAX} characters.`;
    }

    if (!category) {
      newErrors.category = 'Please select a category.';
    }

    const trimmedOptions = options.map((o) => o.trim());

    if (trimmedOptions.some((o) => o.length < OPTION_MIN)) {
      newErrors.options = 'All options must have at least 1 character.';
    } else if (trimmedOptions.some((o) => o.length > OPTION_MAX)) {
      newErrors.options = `Each option must be at most ${OPTION_MAX} characters.`;
    } else {
      // Duplicate check
      const unique = new Set(trimmedOptions.map((o) => o.toLowerCase()));
      if (unique.size !== trimmedOptions.length) {
        newErrors.options = 'Options must be unique.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const created = await createQuestion({
        text: questionText.trim(),
        category,
        options: options.map((o) => o.trim()),
      });
      navigate(`/questions/${created.id}`);
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="text-sm text-indigo-500 hover:text-indigo-700 no-underline">
          ← Back to questions
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Ask a Question</h1>
        <p className="text-sm text-gray-500 mb-6">
          Provide a question, at least 2 options, and a category.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Question text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What's the best programming language?"
              rows={3}
              maxLength={QUESTION_MAX}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.question ? (
                <p className="text-xs text-red-500">{errors.question}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {questionText.trim().length}/{QUESTION_MAX}
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
              <span className="ml-1 text-gray-400 font-normal">
                ({MIN_OPTIONS}–{MAX_OPTIONS})
              </span>
            </label>

            <div className="flex flex-col gap-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    maxLength={OPTION_MAX}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  {options.length > MIN_OPTIONS && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-gray-400 hover:text-red-500 text-lg leading-none px-1 transition-colors"
                      aria-label="Remove option"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.options && (
              <p className="text-xs text-red-500 mt-1">{errors.options}</p>
            )}

            {options.length < MAX_OPTIONS && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add option
              </button>
            )}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <p className="text-sm text-red-500">{errors.submit}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {submitting ? 'Publishing…' : 'Publish Question'}
          </button>
        </form>
      </div>
    </main>
  );
}
