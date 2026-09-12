// ---------------------------------------------------------------------------
// Fake data layer — stands in for the real Spring Boot API during UI dev.
// Every function returns a Promise so swapping to real fetch() calls later
// is a one-file change.
// ---------------------------------------------------------------------------

import type { Question, VoteResult, CreateQuestionRequest } from '../types';

// ── In-memory store ─────────────────────────────────────────────────────────

let nextId = 6;

// Vote counts per optionId, keyed by questionId
const voteCounts: Record<number, Record<number, number>> = {
  1: { 1: 340, 2: 280, 3: 210, 4: 170 },
  2: { 5: 450, 6: 600, 7: 200 },
  3: { 8: 180, 9: 310, 10: 260, 11: 95 },
  4: { 12: 540, 13: 320, 14: 190 },
  5: { 15: 420, 16: 380, 17: 510, 18: 290 },
};

let questions: Question[] = [
  {
    id: 1,
    slug: 'best-way-to-spend-a-sunday',
    text: "What's the best way to spend a Sunday?",
    category: 'Life',
    options: [
      { id: 1, text: 'Stay home and watch movies' },
      { id: 2, text: 'Go out with friends' },
      { id: 3, text: 'Travel somewhere' },
      { id: 4, text: 'Sleep all day' },
    ],
    totalVotes: 1000,
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 2,
    slug: 'best-programming-language',
    text: "What's the best programming language?",
    category: 'Technology',
    options: [
      { id: 5, text: 'Java' },
      { id: 6, text: 'Python' },
      { id: 7, text: 'JavaScript' },
    ],
    totalVotes: 1250,
    createdAt: '2025-01-11T09:00:00Z',
  },
  {
    id: 3,
    slug: 'best-pizza-topping',
    text: 'What is the best pizza topping?',
    category: 'Food',
    options: [
      { id: 8, text: 'Pepperoni' },
      { id: 9, text: 'Cheese' },
      { id: 10, text: 'Vegetables' },
      { id: 11, text: 'BBQ Chicken' },
    ],
    totalVotes: 845,
    createdAt: '2025-01-12T11:00:00Z',
  },
  {
    id: 4,
    slug: 'best-superhero-movie',
    text: 'What is the best superhero movie ever made?',
    category: 'Movies',
    options: [
      { id: 12, text: 'The Dark Knight' },
      { id: 13, text: 'Avengers: Endgame' },
      { id: 14, text: 'Spider-Man: Into the Spider-Verse' },
    ],
    totalVotes: 1050,
    createdAt: '2025-01-13T08:30:00Z',
  },
  {
    id: 5,
    slug: 'best-sport-to-watch',
    text: 'What is the best sport to watch?',
    category: 'Sports',
    options: [
      { id: 15, text: 'Football' },
      { id: 16, text: 'Basketball' },
      { id: 17, text: 'Cricket' },
      { id: 18, text: 'Tennis' },
    ],
    totalVotes: 1600,
    createdAt: '2025-01-14T07:45:00Z',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function totalVotesForQuestion(questionId: number): number {
  const counts = voteCounts[questionId] ?? {};
  return Object.values(counts).reduce((sum, v) => sum + v, 0);
}

function buildVoteResult(question: Question, chosenOptionId: number): VoteResult {
  const counts = voteCounts[question.id] ?? {};
  const total = totalVotesForQuestion(question.id);
  return {
    questionId: question.id,
    chosenOptionId,
    totalVotes: total,
    results: question.options.map((opt) => {
      const votes = counts[opt.id] ?? 0;
      return {
        optionId: opt.id,
        text: opt.text,
        votes,
        percentage: total > 0 ? Math.round((votes / total) * 100) : 0,
      };
    }),
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

// ── Public API surface ────────────────────────────────────────────────────────

/** Fetch all questions (newest first) */
export async function fetchQuestions(): Promise<Question[]> {
  return [...questions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Fetch a single question by numeric id or slug */
export async function fetchQuestion(idOrSlug: string | number): Promise<Question | null> {
  if (typeof idOrSlug === 'number') {
    return questions.find((q) => q.id === idOrSlug) ?? null;
  }
  const asNum = Number(idOrSlug);
  if (!isNaN(asNum)) {
    return questions.find((q) => q.id === asNum) ?? null;
  }
  return questions.find((q) => q.slug === idOrSlug) ?? null;
}

/** Submit a vote; returns the full result breakdown */
export async function submitVote(questionId: number, optionId: number): Promise<VoteResult> {
  const question = questions.find((q) => q.id === questionId);
  if (!question) throw new Error('Question not found');
  if (!question.options.some((o) => o.id === optionId)) throw new Error('Option not found');

  if (!voteCounts[questionId]) voteCounts[questionId] = {};
  voteCounts[questionId][optionId] = (voteCounts[questionId][optionId] ?? 0) + 1;
  question.totalVotes = totalVotesForQuestion(questionId);

  return buildVoteResult(question, optionId);
}

/** Get results without casting a vote (for returning visitors who already voted) */
export async function fetchResults(questionId: number, chosenOptionId: number): Promise<VoteResult> {
  const question = questions.find((q) => q.id === questionId);
  if (!question) throw new Error('Question not found');
  return buildVoteResult(question, chosenOptionId);
}

/** Create a new question */
export async function createQuestion(req: CreateQuestionRequest): Promise<Question> {
  const newQuestion: Question = {
    id: nextId++,
    slug: slugify(req.text),
    text: req.text,
    category: req.category,
    options: req.options.map((text, i) => ({ id: nextId * 10 + i, text })),
    totalVotes: 0,
    createdAt: new Date().toISOString(),
  };
  questions = [newQuestion, ...questions];
  voteCounts[newQuestion.id] = {};
  return newQuestion;
}

export const CATEGORIES = [
  'Technology',
  'Movies',
  'Food',
  'Relationships',
  'Sports',
  'Money',
  'Gaming',
  'Life',
  'Random',
];
