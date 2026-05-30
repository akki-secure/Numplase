import { Difficulty, ScoreRecord, DIFFICULTY_CONFIG } from '@/types/sudoku';

export interface ScoreInput {
  difficulty: Difficulty;
  timeSeconds: number;
  hints: number;
  mistakes: number;
  mode: 'single' | 'npc';
  npcResult?: 'win' | 'lose';
}

export function calculateScore(input: ScoreInput): number {
  const cfg = DIFFICULTY_CONFIG[input.difficulty];
  const base = cfg.coefficient * Math.max(cfg.timeLimitSeconds - input.timeSeconds, 0) * 1000;
  const hintPenalty = input.hints * 500;
  const mistakePenalty = input.mistakes * 200;
  return Math.max(Math.round(base - hintPenalty - mistakePenalty), 0);
}

export function buildScoreRecord(input: ScoreInput): ScoreRecord {
  return {
    id: crypto.randomUUID(),
    mode: input.mode,
    difficulty: input.difficulty,
    score: calculateScore(input),
    timeSeconds: input.timeSeconds,
    hints: input.hints,
    mistakes: input.mistakes,
    npcResult: input.npcResult,
    createdAt: new Date().toISOString(),
  };
}
