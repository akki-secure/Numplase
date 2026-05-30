export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';

export type Board = number[][];

export interface PuzzleData {
  puzzle: Board;
  solution: Board;
  difficulty: Difficulty;
  givenCount: number;
}

export interface ScoreRecord {
  id: string;
  mode: 'single' | 'npc';
  difficulty: Difficulty;
  score: number;
  timeSeconds: number;
  hints: number;
  mistakes: number;
  npcResult?: 'win' | 'lose';
  createdAt: string;
}

export interface NpcCharacter {
  id: string;
  name: string;
  difficulty: Difficulty;
  avatar: string;
  description: string;
}

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; givenMin: number; givenMax: number; coefficient: number; timeLimitSeconds: number; npcDelayMin: number; npcDelayMax: number }
> = {
  easy:   { label: 'かんたん', givenMin: 45, givenMax: 50, coefficient: 1.0, timeLimitSeconds: 600,  npcDelayMin: 3000, npcDelayMax: 6000 },
  normal: { label: 'ふつう',   givenMin: 36, givenMax: 44, coefficient: 1.5, timeLimitSeconds: 1200, npcDelayMin: 1500, npcDelayMax: 3000 },
  hard:   { label: 'むずかしい', givenMin: 27, givenMax: 35, coefficient: 2.5, timeLimitSeconds: 2400, npcDelayMin: 500,  npcDelayMax: 1500 },
  expert: { label: '鬼',       givenMin: 17, givenMax: 26, coefficient: 4.0, timeLimitSeconds: 3600, npcDelayMin: 100,  npcDelayMax: 500  },
};

export const NPC_CHARACTERS: NpcCharacter[] = [
  { id: 'taro',   name: 'たろう',   difficulty: 'easy',   avatar: '🐣', description: 'まだ練習中のひよっこ。一緒に頑張ろう！' },
  { id: 'hana',   name: 'はな',     difficulty: 'normal', avatar: '🌸', description: 'そこそこ得意。油断は禁物。' },
  { id: 'ryu',    name: 'りゅう',   difficulty: 'hard',   avatar: '🐉', description: '上級者。かなり手ごわい。' },
  { id: 'meijin', name: 'AI名人',   difficulty: 'expert', avatar: '🤖', description: '最強AI。ほぼ負けられない覚悟で挑め。' },
];
