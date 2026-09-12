// ---------------------------------------------------------------------------
// Real API layer — talks to the Spring Boot backend at localhost:8080
// Every function signature is identical to fakeApi.ts so no component changes.
// ---------------------------------------------------------------------------

import type { Question, VoteResult, CreateQuestionRequest } from '../types';

const BASE_URL = 'http://localhost:8080/api';

// ── Anonymous voter identity ─────────────────────────────────────────────────
// We generate a UUID once and store it in localStorage forever.
// This is the anonymous "identity" sent with every vote.
// The backend uses it to prevent the same browser from voting twice.
export function getVoterId(): string {
  let id = localStorage.getItem('voteit_voter_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('voteit_voter_id', id);
  }
  return id;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── API shapes returned by Spring Boot ───────────────────────────────────────

interface ApiQuestion {
  id: number;
  text: string;
  category: string;
  totalVotes: number;
  createdAt: string;
  options: { id: number; text: string }[];
}

interface ApiVoteResponse {
  questionId: number;
  chosenOptionId: number;
  totalVotes: number;
  results: { optionId: number; text: string; votes: number; percentage: number }[];
}

// ── Mappers — convert backend shapes to frontend types ───────────────────────

function toQuestion(q: ApiQuestion): Question {
  return {
    id: q.id,
    slug: String(q.id),   // backend doesn't use slugs — use id as slug
    text: q.text,
    category: q.category,
    totalVotes: q.totalVotes,
    createdAt: q.createdAt,
    options: q.options.map(o => ({ id: o.id, text: o.text })),
  };
}

function toVoteResult(v: ApiVoteResponse): VoteResult {
  return {
    questionId: v.questionId,
    chosenOptionId: v.chosenOptionId,
    totalVotes: v.totalVotes,
    results: v.results.map(r => ({
      optionId: r.optionId,
      text: r.text,
      votes: r.votes,
      percentage: r.percentage,
    })),
  };
}

// ── Public API surface (same signatures as fakeApi.ts) ───────────────────────

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch(`${BASE_URL}/questions`);
  const data = await handleResponse<ApiQuestion[]>(res);
  return data.map(toQuestion);
}

export async function fetchQuestion(idOrSlug: string | number): Promise<Question | null> {
  const res = await fetch(`${BASE_URL}/questions/${idOrSlug}`);
  if (res.status === 404) return null;
  const data = await handleResponse<ApiQuestion>(res);
  return toQuestion(data);
}

export async function submitVote(questionId: number, optionId: number): Promise<VoteResult> {
  const res = await fetch(`${BASE_URL}/questions/${questionId}/votes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionId, voterId: getVoterId() }),
  });
  const data = await handleResponse<ApiVoteResponse>(res);
  return toVoteResult(data);
}

export async function fetchResults(questionId: number, chosenOptionId: number): Promise<VoteResult> {
  const res = await fetch(
    `${BASE_URL}/questions/${questionId}/results?chosenOptionId=${chosenOptionId}`
  );
  const data = await handleResponse<ApiVoteResponse>(res);
  return toVoteResult(data);
}

export async function createQuestion(req: CreateQuestionRequest): Promise<Question> {
  const res = await fetch(`${BASE_URL}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: req.text,
      category: req.category,
      options: req.options,
    }),
  });
  const data = await handleResponse<ApiQuestion>(res);
  return toQuestion(data);
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
