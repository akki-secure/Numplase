import { ScoreRecord, Difficulty } from '@/types/sudoku';

const STORAGE_KEY = 'numplace_scores';
const MAX_RECORDS = 100;

export function getScores(): ScoreRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScoreRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveScore(record: ScoreRecord): void {
  if (typeof window === 'undefined') return;
  const scores = getScores();
  scores.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, MAX_RECORDS)));
}

export function getBestScore(difficulty: Difficulty, mode: 'single' | 'npc'): ScoreRecord | null {
  const scores = getScores().filter(s => s.difficulty === difficulty && s.mode === mode);
  if (scores.length === 0) return null;
  return scores.reduce((best, s) => (s.score > best.score ? s : best));
}

export function getRecentScores(limit = 10): ScoreRecord[] {
  return getScores().slice(0, limit);
}

export function clearScores(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
