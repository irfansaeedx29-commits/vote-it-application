// ---------------------------------------------------------------------------
// Core domain types shared across the entire frontend
// ---------------------------------------------------------------------------

/** A single selectable option belonging to a question */
export interface Option {
  id: number;
  text: string;
}

/** The full question as returned by the API (or fake data layer) */
export interface Question {
  id: number;
  slug: string;          // e.g. "best-programming-language" – used in the URL
  text: string;          // The question text
  category: string;
  options: Option[];
  totalVotes: number;
  createdAt: string;     // ISO date string
}

/** Per-option result shown after voting */
export interface OptionResult {
  optionId: number;
  text: string;
  votes: number;
  percentage: number;
}

/** Full result payload returned after a successful vote */
export interface VoteResult {
  questionId: number;
  chosenOptionId: number;
  totalVotes: number;
  results: OptionResult[];
}

/** What the frontend sends when creating a question */
export interface CreateQuestionRequest {
  text: string;
  category: string;
  options: string[];     // plain text of each option
}
