import { Board, Difficulty, PuzzleData, DIFFICULTY_CONFIG } from '@/types/sudoku';

function emptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function shuffled(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fillBoard(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (const num of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: Board, limit = 2): number {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        let count = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            count += countSolutions(board, limit - count);
            board[row][col] = 0;
            if (count >= limit) return count;
          }
        }
        return count;
      }
    }
  }
  return 1;
}

function generatePuzzle(solution: Board, targetGivens: number): Board {
  const puzzle = cloneBoard(solution);
  const positions = shuffled(
    Array.from({ length: 81 }, (_, i) => i)
  );

  let removed = 0;
  const target = 81 - targetGivens;

  for (const pos of positions) {
    if (removed >= target) break;
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const test = cloneBoard(puzzle);
    if (countSolutions(test) !== 1) {
      puzzle[row][col] = backup;
    } else {
      removed++;
    }
  }

  return puzzle;
}

export function createPuzzle(difficulty: Difficulty): PuzzleData {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const targetGivens =
    Math.floor(Math.random() * (cfg.givenMax - cfg.givenMin + 1)) + cfg.givenMin;

  const solution = emptyBoard();
  fillBoard(solution);

  const puzzle = generatePuzzle(solution, targetGivens);
  const givenCount = puzzle.flat().filter(v => v !== 0).length;

  return { puzzle, solution, difficulty, givenCount };
}
