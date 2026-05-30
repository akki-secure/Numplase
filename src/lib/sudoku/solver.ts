import { Board, Difficulty } from '@/types/sudoku';

export interface SolveStep {
  row: number;
  col: number;
  value: number;
}

function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

function getCandidates(board: Board, row: number, col: number): number[] {
  if (board[row][col] !== 0) return [];
  const used = new Set<number>();
  for (let i = 0; i < 9; i++) {
    used.add(board[row][i]);
    used.add(board[i][col]);
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      used.add(board[r][c]);
    }
  }
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !used.has(n));
}

function nakedSingleStep(board: Board): SolveStep | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cands = getCandidates(board, r, c);
      if (cands.length === 1) return { row: r, col: c, value: cands[0] };
    }
  }
  return null;
}

function hiddenSingleStep(board: Board): SolveStep | null {
  // 行・列・ブロックそれぞれで1か所にしか入れない数字を探す
  const units: Array<Array<[number, number]>> = [];

  // 行
  for (let r = 0; r < 9; r++) {
    units.push(Array.from({ length: 9 }, (_, c) => [r, c]));
  }
  // 列
  for (let c = 0; c < 9; c++) {
    units.push(Array.from({ length: 9 }, (_, r) => [r, c]));
  }
  // ブロック
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const cells: Array<[number, number]> = [];
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          cells.push([r, c]);
        }
      }
      units.push(cells);
    }
  }

  for (const unit of units) {
    for (let num = 1; num <= 9; num++) {
      const possible = unit.filter(([r, c]) => getCandidates(board, r, c).includes(num));
      if (possible.length === 1) {
        const [row, col] = possible[0];
        return { row, col, value: num };
      }
    }
  }
  return null;
}

function nakedPairStep(board: Board): SolveStep | null {
  const units: Array<Array<[number, number]>> = [];
  for (let r = 0; r < 9; r++) units.push(Array.from({ length: 9 }, (_, c) => [r, c]));
  for (let c = 0; c < 9; c++) units.push(Array.from({ length: 9 }, (_, r) => [r, c]));
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const cells: Array<[number, number]> = [];
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) cells.push([r, c]);
      }
      units.push(cells);
    }
  }

  for (const unit of units) {
    const empties = unit.filter(([r, c]) => board[r][c] === 0);
    const candMap = empties.map(([r, c]) => ({ r, c, cands: getCandidates(board, r, c) }));
    const pairs = candMap.filter(x => x.cands.length === 2);

    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        const p1 = pairs[i], p2 = pairs[j];
        if (p1.cands[0] === p2.cands[0] && p1.cands[1] === p2.cands[1]) {
          // ペアが確定 → 他のセルからこの2つの候補を除去して確定マスを探す
          const pairVals = new Set(p1.cands);
          for (const { r, c, cands } of candMap) {
            if ((r === p1.r && c === p1.c) || (r === p2.r && c === p2.c)) continue;
            const remaining = cands.filter(v => !pairVals.has(v));
            if (remaining.length === 1) return { row: r, col: c, value: remaining[0] };
          }
        }
      }
    }
  }
  return null;
}

function backtrackStep(board: Board): SolveStep | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const cands = getCandidates(board, r, c);
        if (cands.length > 0) return { row: r, col: c, value: cands[0] };
        return null;
      }
    }
  }
  return null;
}

export type NpcStepFn = (board: Board) => SolveStep | null;

export function getNpcSolver(difficulty: Difficulty): NpcStepFn {
  return (board: Board): SolveStep | null => {
    switch (difficulty) {
      case 'easy':
        return nakedSingleStep(board);
      case 'normal':
        return nakedSingleStep(board) ?? hiddenSingleStep(board);
      case 'hard':
        return nakedSingleStep(board) ?? hiddenSingleStep(board) ?? nakedPairStep(board);
      case 'expert':
        return nakedSingleStep(board) ?? hiddenSingleStep(board) ?? nakedPairStep(board) ?? backtrackStep(board);
    }
  };
}

export function solveFull(board: Board): Board | null {
  const b = cloneBoard(board);
  function bt(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          for (const v of getCandidates(b, r, c)) {
            b[r][c] = v;
            if (bt()) return true;
            b[r][c] = 0;
          }
          return false;
        }
      }
    }
    return true;
  }
  return bt() ? b : null;
}
